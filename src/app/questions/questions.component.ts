import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import questions from '../questions.json';
import * as difflib from 'difflib';
import { element } from 'protractor';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  questionsList:{
  instructions: String,
  problem: String,
  answer:{statement: String,
  align:String,
audioSrc:String}[]}[] = questions;
  check = [];
  bool_check=true;
  alert_failed:boolean = false;
  alert_success:boolean=false;
  isShown: boolean = false ;


// play audio variables
playIcon = 0;
audio = new Audio();
questionAudio = [];





  //--- assigning variables for speech to text -- //
  subscriptionKey = "32634c77f8d44e5baa8295ffba43b5ee";
  serviceRegion = "westus"; // e.g., "westus"
  language = "en-US";
  phraseDiv: any = '';
  lastRecognized: any = '';
  authorizationEndpoint = "https://westus.api.cognitive.microsoft.com/sts/v1.0/issuetoken";
  sdk = sdk;
  speechConfig: sdk.SpeechConfig;
  recognizer: any;
  audioConfig:any = sdk.AudioConfig; 
  pronunciationAssessmentConfig:any = sdk.PronunciationAssessmentConfig;
  pronouncationResult:any;
  refrenceWords:any;
  refWordsComp = [];
  recognizedWords = [];
  pronunciationAssessmentResults = [];
  pronunciationScore:any;
  accuracy:any;
  fluency:any;
  completeness:any;
  wordLevelResult: any;
  result:any;
  item:any;
  referenceText:any;
  wordAccuracy = [];
  wordAccuracyRed = [];
  wordWrongSpell = [];
  recognizedWordWrong =[];
  recognizedWordWrongSpell = [];
  stmt:any;
  aud:any;
  test:any;
  element:any;
  audInd:any;
  
  // <--end-->



  constructor(private route:Router) { }

  ngOnInit(){

    // for(this.aud of this.questionsList){
    //   for(var source of this.aud.answer){
    //     console.log(source.audioSrc);
    //     this.test = source;
    //     console.log(this.test);
        
    //   }
    // }

    for(this.item of this.questionsList){
      var res = this.item.answer.map(function(val){
        return val.audioSrc;
      });

      console.log(res);

        this.test = res;

        console.log(this.test);
    }
  }

  // ========> start recognization event <=====
  sdkStartContinousRecognitionBtn(){
    
    this.speechConfig = sdk.SpeechConfig.fromSubscription(this.subscriptionKey, this.serviceRegion);

    this.speechConfig.speechRecognitionLanguage = 'en-US';
    
    // var refrenceText = "The color of animals is by no means a matter of chance; it depends on many considerations, but in the majority of cases tends to protect the animal from danger by rendering it less conspicuous. Perhaps it may be said that if coloring is mainly protective, there ought to be but few brightly colored animals.";

    for(this.item of this.questionsList){
      var res = this.item.answer.map(function(val){
        return val.statement;
      }).join(",");

      console.log(res);

        this.referenceText = res;

        console.log(this.referenceText);
    }


    this.pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(this.referenceText, sdk.PronunciationAssessmentGradingSystem.HundredMark, sdk.PronunciationAssessmentGranularity.Word, true);

    this.recognizer = new sdk.SpeechRecognizer(this.speechConfig);

    this.pronunciationAssessmentConfig.applyTo(this.recognizer);

    this.recognizer.recognizing = (s, e) => {
      console.log("(recognizing) Reason: " + sdk.ResultReason[e.result.reason] + "Text: " + e.result.text);
      let str = this.lastRecognized + e.result.text;
      this.phraseDiv = str;

    };

    this.recognizer.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.NoMatch) {
          const noMatchDetail = sdk.NoMatchDetails.fromResult(e.result);
          console.log("(recognized)  Reason: " + sdk.ResultReason[e.result.reason] + " | NoMatchReason: " + sdk.NoMatchReason[noMatchDetail.reason]);
      } else {
          console.log(`(recognized)  Reason: ${sdk.ResultReason[e.result.reason]} | Duration: ${e.result.duration} | Offset: ${e.result.offset}`);
          this.pronouncationResult = sdk.PronunciationAssessmentResult.fromResult(e.result);
          // console.log(`[Pronunciation result] Accuracy: ${this.pronouncationResult.accuracyScore}; Fluency: ${this.pronouncationResult.fluencyScore}; Completeness: ${this.pronouncationResult.completenessScore}`);
          this.pronunciationAssessmentResults.push(this.pronouncationResult);
          this.wordLevelResult = this.pronouncationResult.detailResult.Words;
          console.log('Word Level Result:' , this.wordLevelResult);
          console.log(`Text: ${e.result.text}`);
          this.lastRecognized += e.result.text;
          this.phraseDiv = this.lastRecognized;
      }
    };
  
    this.recognizer.canceled = (s, e) => {
      let str = "(cancel) Reason: " + sdk.CancellationReason[e.reason];
        if (e.reason === sdk.CancellationReason.Error) {
            str += ": " + e.errorDetails;
        }
        console.log(str);
    };

    this.recognizer.speechStartDetected = (s, e) => {
      console.log(`(speechStartDetected) SessionId: ${e.sessionId}`);
    },
  
    this.recognizer.speechEndDetected = (s, e) => {
        console.log(`(speechEndDetected) SessionId: ${e.sessionId}`);

        this.refrenceWords = this.referenceText.toLowerCase().replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g,"");

        this.refrenceWords = this.refrenceWords.split(' ');

        for(var ref of this.refrenceWords){
          this.refWordsComp.push(ref);
        }
  
        var sumDuration = 0;
        var sumAccuracy = 0;
        var sumFluency = 0;
        var sumPronunciationScore = 0;
        for (var result of this.pronunciationAssessmentResults) {

          var duration = 0;
          for(var word of result.detailResult.Words){
            this.recognizedWords.push(word.Word);
            duration += word.Duration;
            if(word.PronunciationAssessment.AccuracyScore < 80){
              this.recognizedWordWrong.push(word.Word);
              // console.log(this.recognizedWordWrong);
            }
          }
          sumDuration += duration;
          sumAccuracy += duration * result.accuracyScore;
          sumFluency += duration * result.fluencyScore;
          sumPronunciationScore += duration * result.pronunciationScore;
        }
  
        this.accuracy = (sumAccuracy / sumDuration).toFixed();
        this.fluency = (sumFluency / sumDuration).toFixed();
        this.pronunciationScore = (sumPronunciationScore / sumDuration).toFixed();
  
        var diff = new difflib.SequenceMatcher(null, this.refrenceWords, this.recognizedWords);

        console.log(this.recognizedWordWrong);

        var diffWordsNum = 0
        for(var d of diff.getOpcodes()){
          if(d[0] == 'delete' || d[0] == 'replace'){
            diffWordsNum += (d[2] - d[1]);
          }
        }
  
        this.completeness = ((1 - diffWordsNum/this.refrenceWords.length)*100).toFixed();
        console.log(`[Overall Pronunciation result] Accuracy: ${this.accuracy}; Fluency: ${this.fluency}; Completeness: ${this.completeness}; Pronunciation Score: ${this.pronunciationScore}`);
    };

  
    this.recognizer.startContinuousRecognitionAsync(() => {
            console.log('Recognition started');
            this.phraseDiv = 'recognization started';
    });

  };

// ========> Stop recognization event <=====
  sdkStopContinousRecognitionBtn(){
    
    this.recognizer.stopContinuousRecognitionAsync(() => {

      this.recognizer.close();
      console.log("stopped");
      // this.answer = this.phraseDiv;
      console.log("answer: " + this.phraseDiv);
    },
    err => {
      console.trace("err - " + err);
      this.recognizer.close();
    });

    this.isShown = ! this.isShown;
  };

  // ========> audio <=====

  playRecord = 0;
  setTimeOutId : any;

  // playingAudio(){
  //   if(this.isShown == true){
  //     this.playAudio();
  //   }

  // }

  
  playAudio(ind) { 
    if(this.isShown == true){
      this.audInd = ind;   
    var duration = 0;
    if(this.playRecord ==0){
      this.playIcon = 0;
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src='';
      duration = 0;
      clearTimeout(this.setTimeOutId);
    } 
    else{
      this.audio = new Audio();
        this.audio.src = this.test[ind];
        console.log(this.audio.src);
      this.audio.load();
      this.audio.play();
    this.audio.preload = 'metadata';
    this.audio.onloadedmetadata = () =>{
      console.log(this.audio.duration);
       duration = this.audio.duration * 1000;
      this.playIcon = 1;
      this.setTimeOutId = setTimeout(() => {
        this.playIcon = 0;
        console.log("executed");
      }, duration);
    };
    }

    }
    
  }

  stopAudio() {
    this.audio = new Audio();
    this.audio = new Audio();
    for (let index = 0; index < this.test.length; index++) {
      this.element = this.test[index];
      console.log(this.element);
      this.audio.src = this.element;
      
    }
      console.log(this.audio.src);
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  displayStats(){
    this.route.navigate(['/stats']);
  }

}
