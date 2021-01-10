/*global chrome*/
import './App.css';
import { useState,useEffect,useCallback } from 'react';
import React from 'react';
import { createGlobalState } from 'react-hooks-global-state';

const initialState = { sentiment: 0 , sentence: '' };
const { setGlobalState,useGlobalState } = createGlobalState(initialState);

//get what user is typing
var user_typed = ''
document.addEventListener('keypress', function(e){
  if(e.key=='Enter'){
    get_from_user_typed(user_typed);
    user_typed='';
  }
  else if(e.key==" "){
    user_typed += " ";
  }
  else{
    user_typed += e.key;
  }
  console.log(user_typed,e);
});

async function get_from_user_typed(user_input) {
  
  const handleResponse = (response) => {
    if (response.error) {
      setGlobalState('sentiment',response.error);
      console.log(response.error);
    } else {
      console.log(response.sentiment_score);
      setGlobalState('sentiment',response.sentiment_score);
      var op1=String(user_input)+"\n"+String(response.sentiment_score);
      if (response.sentiment_score>=0){
        op1+="\n The Text is Not Offensive";
      }
      else{
        op1+="\n Please change your Text,it is Offensive";
      }
      alert(op1);
    }
  };
  console.log(user_input);
  chrome.runtime.sendMessage({message: user_input}, handleResponse);
  
  }

  
function App() {

const [sentence, setSentence] = useGlobalState('sentence');
const [sentiment, setSentiment] = useGlobalState('sentiment');

  useEffect(() => {
    quickstart();
  }, []);

  const getList = useCallback(() => {
    quickstart();
  }, [sentiment,sentence]);

  const quickstart = () => {
    var allInputs = document.getElementsByTagName('body')[0].innerHTML;
    var stripedHtml = allInputs.replace(/<[^>]+>/g, '');
    console.log(1,stripedHtml);
    var sentence_list = stripedHtml.split(".");
    var sentiment_average=0;
    console.log(sentence_list);
    for (var i = 0; i < sentence_list.length; i++) {
      const handleResponse = (response) => {
        if (response.error) {
          setGlobalState('sentiment',response.error);
        } else {
          sentiment_average+=response.sentiment_score;
        }
      };
      
      chrome.runtime.sendMessage({message: sentence_list[i]}, handleResponse);
  }
    console.log(sentiment_average);
    setGlobalState('sentiment',sentiment_average);
    
    setGlobalState('sentence',"Sentiment of Whole Website");
  }
  return (
    <div>
      
    <div className="header">
          <h1>BULLY-IN-SPECT</h1>
          <p>Extension to filter offensive speech</p>
        </div>
        <div className="contentBox">
          <div className="pattern">
            <p>To start inspecting offensive words/websites, <span className="resalted">follow the steps</span>:</p>
            <p>1. Click on Extension and Start Typing and Once You are Finished Press Enter.It will give you the Results of Your Text</p>
            <p>2. Open Any Website any it will tell if it good to visit</p>
            <p> If Output is <span className="resalted1">Negative (-1 to 0)Then Text/Site is Offensive</span></p>
            <p> If Output is <span className="resalted2">Positive (0 to 1) Then Text/Site is Positive</span></p>
            <p> If Output is <span className="resalted3">0 Then Text/Site is Neutral</span></p>
            <h3>Output</h3>
            <p>Sentence : {sentence} </p>
            <p>Sentiment : {sentiment}</p>
          </div>
        </div>
        <div className="footer">
          <a href="https://github.com/aniketdhole07/BULLY-IN-SPECT" target="_blank"><p>By Katie,Bayan,Daniel,Aniket</p></a>
        </div>
    </div>
  );
}

export default React.memo(App);
