const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

//* api to send previous chat messages between two specific users
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  //* receiving  targetUserId from the path parameters (Url params /:targetUserId ) dynamically as for every chat targetUserId can be different

  const { targetUserId } = req.params;
  console.log(targetUserId + " from chat");

  const userId = req.user._id;
  console.log(userId);

  //* implementation of sending limited messages to frontend(also we can say kind of pagination)
  //* getting the skip and limit value from query parameters(Query Strings ?skip=value&limit=value)

  const { limit = 50, skip = 0 } = req.query; //* default value skip 0 , and limit = 50 , if no query params are passed, so it will skip no messages , and give last 50 messages because limit is set to 50 as default
  const parsedLimit = parseInt(limit); //* parsing limit to integer from string
  const parsedSkip = parseInt(skip); //* parsing skip to integer from string
  console.log(parsedSkip + "skip & limit " + parsedLimit);

  //* To check total number of messages in db (if not exist any it will not through any error instead it will just set messageCountInDb value to 0)
  const chatInfo = await Chat.findOne({
    participants: { $all: [userId, targetUserId] },
  });

  const messageCountInDb = chatInfo ? chatInfo.messages.length : 0;
  // console.log("message count " + chatInfo.messages.length);
  /*
   * Logic for calculating the sliceRange according to the skip and limit value:
   * skip=0 & limit=50  -> slice: [-50] (Last 50 messages)
   * skip=50 & limit=50 -> slice: [-100, 50] (Next 50 older messages after skipping last 50) 
   * (so when skip is passed 50 , and limit is passed 50 , then we are doing [-(skip+limit),limit]= [-(50+50),50] = slice[-100,50]  start slicing the array from last 100 and then give 50 , that's why we can get 50 messages after skipping last 50 , so slice(start,end) so first param is where the slicing starts , and second is for how much is number of slice we need , so after how many objects the slicing will stop)
   *  when skip= 10 & limit=20 => slice[-(10+20),20] => slice[-30,20] (so we can skip last 10 messages,and get 20 messages before it because slicing will start from -30 and stop after 20  )
   * skip=100 & limit=50 -> slice: [-150, 50] (Next 50 older messages after skipping 100)
  
   */
  //* sliceRange  is a array which will passed inside slice("messages",sliceRange) method, to slice messages array according to the skip and limit we will get from the frontend, in slice() method normally first param is where the slicing starts , and second is for how many indexes it will slice. in this case while we will do the query mentioning the messages is necessary as messages will be present inside chat object as messages property,so in this case the "messages" will be first param and then second param will be the sliceRange array where first index  is where the slicing starts(as we want to get latest messages first, so we have to start the slicing using negative value that's why sliceRange array's first index will be a negative value always to get the indexes from last like -50 to start slicing from last 50 index) , and second index is for how many indexes it will slice(like if value is 20 and it will start slicing from last 50 th(-50) index and slice 20 indexes).
  let sliceRange; //*
  if (parsedSkip === 0) {
    //*for initial load :- when skip=0  -> slice: -50 (Last 50 messages)
    sliceRange = -parsedLimit;
  } else if (parsedSkip + parsedLimit >= messageCountInDb) {
    //* when skip value exceeds total messages available in database(as first value of slice method is where the slicing gets started which we calculate by adding the skip and limit, so when the starting value of slice method exceeds the or equals to the message count on the database, then we will subtract the skip value from the total message count on database , to get the number of remaining messages)
    const remainingMessages = messageCountInDb - parsedSkip;
    console.log(remainingMessages + "remaining messages");
    //* now the sliceRange array's first index will be skipped + remainingMessages , so the indexing can start from exactly how many messages are remaining, (so if skip=100 , limit= 20 , remaining messages=4(104-100) , then first index of slice range array will be -(skip+remainingMessages) =  -(100+4) = -104 to start slicing 104th last message(-104)),  and then second index is remainingMessages(4 to slice only 4 indexes from last 104th(-104) message ) , so it can only send the remaining messages as second index is for how many indexes it will slice.
    sliceRange = [-(parsedSkip + remainingMessages), remainingMessages];
  } else {
    //* this else block will be executed when it is neither the initial api call ,nor the case when remaining messages not sent to frontend are less than the skip+limit we get from frontend(above case), so basically it is in between case.
    //* in this case first sliceRange array's first index will be -(skip+limit) , so if the skip is 100 and limit is 20 then , slicing can start from -120 and second index will limit , so from the last 120 th(-120) index it can slice 20 indexes only.
    // In sliceRange 1st index value to Start slicing from -(skip + limit) from the end as it is negative value, and second index is limit to slice only indexes we got as limit.
    sliceRange = [-(parsedSkip + parsedLimit), parsedLimit];
    console.log("sliceRange" + sliceRange);
  }

  console.log("SliceRange" + Array.isArray(sliceRange));

  try {
    //* finding the existing chat so we can return the past messages
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    })
      .slice("messages", sliceRange)
      .populate({
        path: "messages.senderId",
        select: "firstName lastName",
      });
    //* populating firstName lastName, same as writing :- .populate("messages.senderId","firstName lastName");
    //*.slice("messages", sliceRange) is for Apply the dynamic slice ( to only send messages according to the skip and limit we get from frontend - logic explained where sliceRange array is created, slice("messages" is the path of array we want o slice  messages array which will be present inside the chat object like object.messages , and sliceRange is the array where first index will the index from which slicing will start , and as we want the latest messages , so this first index will be a negative value  to  start the slicing from the last end of the messages array and second index of sliceRange will be the the limit , so basically how many indexes we want to slice, for example - we have total 300 messages in messages array,and sliceRange is [-100,50] then it will calculate starting point of slicing from the last of the array so -100 means it will start from (300 - 100)= 200 th messages(for -100 ,first index in sliceRange) , and for slice till 250 th message index ( for 50 ,second index in sliceRange)  ))

    //* if there is no past  then we  messages  can create a new chat and send it to frontend
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
    }
    // console.log("new" + chat);
    //* saving chat
    await chat.save();
    //* sending the past chat (if existed ) or new empty chat(if there is no new previous chat)
    res.json(chat);
  } catch (err) {
    res.status(400).json({ message: "something went wrong:- " + err.message });
  }
});

module.exports = chatRouter;
