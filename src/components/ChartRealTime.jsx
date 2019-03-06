import React, { Component } from "react";
import ReactEcharts from 'echarts-for-react';
import Tool from "../common/Tool";

/**
 * 心率表
 */
class HeartRate extends Component {
    constructor(props) {
        super(props);
        this.drawIndex=0;//绘制波的进度
        this.lineCount=0;//画直线计数，用于每隔段距离，画一个断点
        this.dataModel=[
            0,0.5,1,-1,-2,-0.9,.2,0,2,0.5,-1,-0.5,0,0.5,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0.3,-1,-2,2,0.5,-1,0,-1,0.5,0,0,-1,-2,-0.1,1.8,0.9,0,0,
            -1.4,-0.2,1,0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0.5,1,-1,-2,-0.9,.2,0,2,0.5,-1,-0.5,0,0.5,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0.3,-1,-2,2,0.5,-1,0,-1,0.5,0,0,-1,-2,-0.1,1.8,0.9,0,0,
            -1.4,-0.2,1,0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        ]
        this.xData=[];
        this.initDataModel(180);
        this.setInitData();
    }
    componentWillReceiveProps(nextProps){
        if(this.props.time!==nextProps.time){
            if(this.props.time===0){
                this.initDataModel(180);
                this.setInitData();
            }else{
                if(nextProps.heartRate===0&&this.drawIndex===0){
                    this.setDynamicData(this.drawIndex,true);
                }else{
                    this.setDynamicData(this.drawIndex,false);
                    this.drawIndex++;
                    this.drawIndex%=180;
                }
            }
        }
    }
    shouldComponentUpdate(){
        return false;
    }
    initDataModel(pointNumber){
        for(let i=0;i<pointNumber;i++){
            this.xData[i]=i;
        }
    }
    getDataModel(v){
        return v*this.props.heartRate/4+20;
    }
    setInitData(){
        let getData=()=>{
            let resultValue = this.dataModel.map((v)=>{
                return this.getDataModel(v)
            })
            return resultValue;
        };
        this.data = getData();
    }
    setDynamicData(i,b){
        this.data.pop();
        if(b){
            this.lineCount++;
            this.lineCount = this.lineCount%180;
            if(this.lineCount<5){
                this.data.unshift(null);
            }else{
                this.data.unshift(this.getDataModel(this.dataModel[i%180]));
            }
        }else{
            this.lineCount=0;
            this.data.unshift(this.getDataModel(this.dataModel[i%180]));
        }
        this.charts.setOption({
            series:{
                data:this.data
            }
        })
    }
    getOtion() {
        let option = {
            animation:false,
            grid: {
                left: Tool.jsNum4(0),
                right: Tool.jsNum4(80),
                containLabel: false
            },
            xAxis: {
                data:this.xData,
                boundaryGap: false, 
                axisLine: {
                    show: false,
                    lineStyle: {
                        width: Tool.jsNum4(3),
                        color: 'rgba(153,153,153,1)'
                    }
                },
                axisTick: {     
                    show: false
                },
                axisLabel: { 
                    show: false,
                    interval: 2,
                    textStyle: {
                        fontSize: Tool.jsNum4(25),
                        color: 'rgba(255, 255, 255, 1)'
                    },
                    margin: Tool.jsNum4(20)
                }
            },
            yAxis: {
                min:-Tool.jsNum4(80),
                max:Tool.jsNum4(100),
                // Y轴样式
                axisLine: {
                    show: false
                },
                // 刻度线显示与否
                axisTick: {     
                    show: false,
                },
                // 文字样式
                show: false,
                // 网格样式
                splitLine: {
                    show: false,
                },
                splitArea: {
                    show : false,
                }
            },
            series: [{
                name: '模拟数据',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: this.data,
                lineStyle:{
                    color: 'rgba(10, 172, 182, 1)',
                    width: Tool.jsNum4(3)
                },
            }],
            // animation:false,
            animationDurationUpdate:500,
            animationEasingUpdate:'linear'
        };
        return option;
    }
    render() {
        return (
            <ReactEcharts
                option={this.getOtion()}
                ref={(e) => { this.charts= e ? e.getEchartsInstance() : ''; }}
                style={{height: '100%', width: '100%'}}
                className='react_for_echarts sleep_chart' />
        );
    }
}

/**
 * 呼吸图表
 */
class RespirationRate extends Component {
    constructor(props) {
        super(props);
        this.now = + new Date();
        this.dataModel=[];
        this.xData=[];
        this.tmpBreathRate=0;
        this.drawIndex=0;//绘制波的进度
        this.lineCount=0;//画直线计数，用于每隔段距离，画一个断点
        this.initDataModel(180);
        this.setInitData();
    }
    componentWillReceiveProps(nextProps){
        if(this.props.time!==nextProps.time){
            if(this.props.time===0){
                this.initDataModel(180);
                this.setInitData();
            }else {
                if(nextProps.breathRate===0&&this.drawIndex===0){
                    this.setDynamicData(this.drawIndex,true);

                }else{
                    this.setDynamicData(this.drawIndex,false);
                    this.drawIndex++;
                    this.drawIndex%=180;
                }
            }
        }
    }
    shouldComponentUpdate(){
        return false;
    }
    initDataModel(pointNumber){
        let calc = (angle)=>{
            return Math.sin(angle*Math.PI/180);
        }
        for(let i=0;i<pointNumber;i++){
            // this.dataModel[i]=0;
            this.dataModel[i]=calc((360/(pointNumber/2)*((i)%90)));
            this.xData[i]=i;
        }
    }
    getDataModel(v){

        // console.log(v,v*this.props.breathRate);
        return v*16+20;
    }
    setInitData(){
        let getData=()=>{
            let resultValue = this.dataModel.map((v)=>{
                return this.getDataModel(0)
            })
            return resultValue;
        };
        this.data = getData();
    }
    setDynamicData(i,b){
        this.data.pop();
        if(b){
            this.lineCount++;
            this.lineCount = this.lineCount%180;
            if(this.lineCount<5){
                this.data.unshift(null);
            }else{
                this.data.unshift(this.getDataModel(this.dataModel[i%180]))
            }
        }else{
            this.lineCount=0;
            this.data.unshift(this.getDataModel(this.dataModel[i%180]))
        }
        this.charts.setOption({
            series:{
                data:this.data
            }
        })
    }
    getOtion() {
        let option = {
            grid: {
                left: Tool.jsNum4(0),
                right: Tool.jsNum4(80),
                containLabel: false
            },
            xAxis: {
                data:this.xData,
                boundaryGap: false, 
                axisLine: {
                    show: false,
                    lineStyle: {
                        width: Tool.jsNum4(3),
                        color: 'rgba(153,153,153,1)'
                    }
                },
                axisTick: {     
                    show: false
                },
                axisLabel: { 
                    show: false,
                    interval: 2,
                    textStyle: {
                        fontSize: Tool.jsNum4(25),
                        color: 'rgba(255, 255, 255, 1)'
                    },
                    margin: Tool.jsNum4(20)
                }
            },
            yAxis: {
                min:-Tool.jsNum4(60),
                max:Tool.jsNum4(80),
                // Y轴样式
                axisLine: {
                    show: false
                },
                // 刻度线显示与否
                axisTick: {     
                    show: false,
                },
                // 文字样式
                show: false,
                // 网格样式
                splitLine: {
                    show: false,
                },
                splitArea: {
                    show : false,
                }
            },
            series: [{
                name: '模拟数据',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: this.data,
                lineStyle:{
                    color: 'rgba(10, 172, 182, 1)',
                    width: Tool.jsNum4(3)
                },
                smooth:true,
                animationDurationUpdate:100,
                animationEasingUpdate:'linear'
            }]
        };
        return option;
    }
    render() {
        return (
            <ReactEcharts
                option={this.getOtion()}
                ref={(e) => { this.charts= e ? e.getEchartsInstance() : ''; }}
                style={{height: '100%', width: '100%'}}
                className='react_for_echarts sleep_chart' />
        );
    }
}
/**
 * 翻身图表
 */
class TurnOver extends Component {
    constructor(props) {
    super(props);
    this.now = + new Date();
    this.newCount=0;//新的翻身次数，需要等待绘制
    this.drawIndex=0;//绘制指针
    this.lineCount=0;//画直线计数，用于每隔段距离，画一个断点
    this.dataModel=[
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    ];
    this.turnChartData=[1,1,1,1,1,1,1,1,1,1,0,0];
    this.xData=[];
    this.initDataModel(180);
    this.setInitData();
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.time<=1){
            this.newCount=0;
        }else{
            this.newCount=this.newCount+ nextProps.turnOverCount-this.props.turnOverCount;
        }
        this.newCount=this.newCount<0?0:this.newCount;
        if(this.props.time!==nextProps.time){
            if(this.props.time===0){
                this.initDataModel(180);
                this.setInitData();
            }else {
                this.setDynamicData(nextProps.time);
            }
        }
    }

    shouldComponentUpdate(){
        return false;
    }
    initDataModel(pointNumber){
        for(let i=0;i<pointNumber;i++){
            this.xData[i]=i;
        }
    }
    getDataModel(v){
        return v;
    }
    setInitData(){
        let getData=()=>{
            let resultValue = this.dataModel.map((v)=>{
                this.now += 1000;
                return this.getDataModel(v)
            })
            return resultValue;
        };
        this.data = getData();
    }
    setDynamicData(){
        this.now += 1000;
        this.data.pop();
        if(this.newCount>0){
            this.data.unshift(this.getDataModel(this.turnChartData[this.drawIndex]));
            this.drawIndex++;
            this.drawIndex=this.drawIndex%this.turnChartData.length;
            if(this.drawIndex===0){
                this.newCount--;
                this.lineCount=0;
                this.cantDrawNull=true;//阻止画完波后第一次画断层
            }
        }else{
            this.lineCount++;
            this.lineCount = this.lineCount%180;
            if(this.lineCount<5&&!this.cantDrawNull){
                this.data.unshift(null);
            }else{
                this.data.unshift(0);
                if(this.lineCount===4){
                    this.cantDrawNull=false;
                }
            }
        }
        this.charts.setOption({
            series:{
                data:this.data
            }
        })
    }
    getOtion() {
        let option = {
            grid: {
                left: Tool.jsNum4(0),
                right: Tool.jsNum4(80),
                top: Tool.jsNum4(110),
                containLabel: false
            },
            xAxis: {
                data:this.xData,
                boundaryGap: false, 
                axisLine: {
                    show: false,
                    lineStyle: {
                        width: Tool.jsNum4(3),
                        color: 'rgba(153,153,153,1)'
                    }
                },
                axisTick: {     
                    show: false
                },
                axisLabel: { 
                    show: false,
                    interval: 2,
                    textStyle: {
                        fontSize: Tool.jsNum4(25),
                        color: 'rgba(255, 255, 255, 1)'
                    },
                    margin: Tool.jsNum4(20)
                }
            },
            yAxis: {
                min:-Tool.jsNum4(3),
                max:Tool.jsNum4(2),
                // Y轴样式
                axisLine: {
                    show: false
                },
                // 刻度线显示与否
                axisTick: {     
                    show: false,
                },
                // 文字样式
                show: false,
                // 网格样式
                splitLine: {
                    show: false,
                },
                splitArea: {
                    show : false,
                }
            },
            series: [{
                name: '模拟数据',
                type: 'line',
                step: 'end',
                showSymbol: false,
                hoverAnimation: false,
                data: this.data,
                lineStyle:{
                    color: 'rgba(10, 172, 182, 1)',
                    width: Tool.jsNum4(3)
                },
                animation:false,
                animationDurationUpdate:500,
                animationEasingUpdate:'linear'
            }]
        };
        return option;
    }
    render() {
        return (
            <ReactEcharts
                option={this.getOtion()}
                ref={(e) => { this.charts= e ? e.getEchartsInstance() : ''; }}
                style={{height: '100%', width: '100%'}}
                className='react_for_echarts sleep_chart' />
        );
    }
}


export {HeartRate, RespirationRate, TurnOver};
