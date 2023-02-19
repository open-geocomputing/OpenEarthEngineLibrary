// console.log(process.argv)
var zeromq = require("zeromq");
ee = require('@google/earthengine');
var request = require('request');
const fs = require('fs');
var path = require('path');
var unpromisefy = require('unpromisefy');

const socket = new zeromq.Reply;
const socketInv = new zeromq.Request;
socketInv.immediate=true;
port=process.argv[2];
port2=process.argv[3];
tocken=process.argv[4];

libs={}


readInputs=function(args,inputs){
  var output={};
  var arrayInput=false;
  if(args.length==1 && typeof(args[0])==typeof({}) 
    && (inputs.map(function(x){return x.name}).filter(function(value){
        return Object.keys(args[0]).indexOf(value)==-1}).length==0)){
            output=args[0];
        }else{
            arrayInput=true;
            for (var i = args.length - 1; i >= 0; i--) {
                output[inputs[i].name]=args[i];
            }
        }
        var listKeys=Object.keys(output);
        for (var i=0; i<inputs.length; i++){
            if(listKeys.indexOf(inputs[i].name)>=0){

            }
            else{
              // if list param
              if(args.length<=i || arrayInput){

                //put default value
                if(!inputs[i].optional)
                  if (inputs[i].defaultValue!='undefined')
                      output[inputs[i].name]=inputs[i].defaultValue;
              }
              else{
                //if(!inputs[i].optional)
                {
                    output[inputs[i].name]=args[i];
                }
            }
        }
    }
    return output;
}


function loadOverloads(){

    Map.addLayer=function(){
        let inputs=[
            {name:'eeObject',optional:false},
            {name:'visParams',optional:true},
            {name:'name',optional:true},
            {name:'shown',optional:true},
            {name:'opacity',optional:true},
        ]
        let args=readInputs(arguments,inputs);
        args['eeObject']=encodeInput(args['eeObject']);
        socketInv.send(JSON.stringify({function:'Map.addLayer',payload:args}));
        while(!socketInv.readable);
        socketInv.receive();
    }
    Map.centerObject=function(){
        let inputs=[
            {name:'object',optional:false},
            {name:'zoom',optional:true},
            {name:'onComplete',optional:true},
        ]
        let args=readInputs(arguments,inputs);
        coord=args['object'].geometry().centroid().coordinates().getInfo();
        coord={lon:coord[0],lat:coord[1]}
        if(args['zoom'])
            coord['zoom']=args['zoom'];
        Map.setCenter(coord);
        if(args['onComplete'])
            coord['onComplete']();
    }
    Map.setCenter=function(){
        let inputs=[
            {name:'lon',optional:false},
            {name:'lat',optional:false},
            {name:'zoom',optional:true},
        ]
        let args=readInputs(arguments,inputs);
        socketInv.send(JSON.stringify({function:'Map.setCenter',payload:args}))
        while(!socketInv.readable);
        socketInv.receive()
    }
    Map.setControlVisibility=function(){
        let inputs=[
            {name:'all',optional:true},
            {name:'layerList',optional:true},
            {name:'zoomControl',optional:true},
            {name:'scaleControl',optional:true},
            {name:'mapTypeControl',optional:true},
            {name:'fullscreenControl',optional:true},
            {name:'drawingToolsControl',optional:true}
        ]
        let args=readInputs(arguments,inputs);
        socketInv.send(JSON.stringify({function:'Map.setControlVisibility',payload:args}))
        while(!socketInv.readable);
        socketInv.receive()
    }
    Map.setOptions=function(){
        let inputs=[
            {name:'mapTypeId',optional:true},
            {name:'styles',optional:true},
            {name:'types',optional:true}
        ]
        let args=readInputs(arguments,inputs);
        socketInv.send(JSON.stringify({function:'Map.setOptions',payload:args}))
        while(!socketInv.readable);
        socketInv.receive()
    }
    Map.setZoom=function(){
        let inputs=[
            {name:'zoom',optional:false},
        ]
        let args=readInputs(arguments,inputs);
        socketInv.send(JSON.stringify({function:'Map.setZoom',payload:args}))
        while(!socketInv.readable);
        socketInv.receive()
    }
    Map.getCenter=function(){
        socketInv.send(JSON.stringify({function:'Map.getCenter'}))
        while(!socketInv.readable);
        const result = JSON.parse(unpromisefy.unpromisefy(socketInv.receive()))
        return decode(result['payload']);
    }
    Map.getScale=function(){
        socketInv.send(JSON.stringify({function:'Map.getScale'}))
        while(!socketInv.readable);
        const result = JSON.parse(unpromisefy.unpromisefy(socketInv.receive()))
        return decode(result['payload']);
    }
    Map.getZoom=function(){
        socketInv.send(JSON.stringify({function:'Map.getZoom'}))
        while(!socketInv.readable);
        const result = JSON.parse(unpromisefy.unpromisefy(socketInv.receive()))
        return decode(result['payload']);
    }

    // Map.getCenter=function(){
    //     return ee.Geometry.Point([0,0]);
    // }
    // Map.getScale=function(){
    //     return 100
    // }
    // Map.getZoom=function(){
    //     return 1
    // }
    
    print=function(){
        arg=[...arguments];
        socketInv.send(JSON.stringify({function:'print',payload:arg}))
        while(!socketInv.readable);
        socketInv.receive()
        //const result = JSON.parse(await socketInv.receive()).toString();
    }

    ui={util:{setTimeout:setTimeout}};
}


function loadOeelLib(){
    return require('./OEEL/loadAll4py').all;
}

function loadLib(str){
    return require(str);
}

function encodeInput(input){
    if(typeof input === 'function'){
        console.error("This function is currently unavailable");
        return {'type':'function','value':input}
    }
    if(input instanceof ee.ComputedObject){
        return {'type':'ee','ee_type':input.name(),'value':JSON.stringify(ee.Serializer.encode(input))};
    }
    return {'type':'other','value':JSON.stringify(ee.Serializer.encode(input))};
}

function decodeInput(input){
    if(input.type=='function'){
        return function(){
            let args=[...arguments];
            if(!args.every(x=>x.varName)) return args[0];
            for (var i = args.length - 1; i >= 0; i--) {
                args[i]=encodeInput(args[i]);
            }

            socketInv.send(JSON.stringify({function:input.value,payload:args}))
            while(!socketInv.readable);
            let answer=socketInv.receive();
            answer=JSON.parse(unpromisefy.unpromisefy(answer));
            return decodeInput(answer.payload);
        }
    }
    else if(input.type=='ee'){
        return ee[input.ee_type](ee.Deserializer.fromJSON(input.value))
    }else{
        return ee.Deserializer.fromJSON(input.value)
    }
}

function onPythonMessage (envelope, blank, data)
{
    let answer='failed';
    let message=JSON.parse(envelope);
    if(message.type=='load'){
        if(message.lib=='users/OEEL/lib:loadAll'){
            oeel=loadOeelLib(message.lib)
            answer={sucess:true}
        }else{
            libs[message.lib]=loadLib(message.lib);
            availableElement={};
            for (key in libs[message.lib]) {
                availableElement[key]=typeof(libs[message.lib][key]);
            }
            answer={sucess:true, id:message.lib, availability:availableElement}
        }
        
    }
    if(message.type=='unload'){
        delete libs[message.lib];
        answer={sucess:true, id:message.lib, availability:null}
    }
    if(message.type=='call'){
        if(message.args){
            for(element in message.args){
                message.args[element]=decodeInput(message.args[element]);
            }
        }
        if(message.argl){
            for(var i=0; i<message.argl.length; i++){
                message.argl[i]=decodeInput(message.argl[i]);
            }
        }
        let result=null;
        if(message.lib=='oeel'){
            var functionName=eval('oeel'+message.functionName)
            result=functionName(message.args);
        }else{
            var functionName=eval('libs[message.lib].'+message.functionName)
            if(typeof(functionName)!='function')
            {
                result=functionName;
            }
            else{
                if(message.argl && message.argl.length>0){
                    result=functionName(...message.argl);
                }
                else{
                    result=functionName(message.args);
                }
            }
        }
        if (result){
            answer={payload:encodeInput(result)}
        }
        else{
            answer={}
        }
    }

    return (JSON.stringify(answer));
}


var runAnalysis = function() {
    ee.initialize(null, null, async function() {
        //console.log(ee.apiclient.getXsrfToken())
        socketInv.connect("tcp://127.0.0.1:"+port2);
        await socket.bind("tcp://127.0.0.1:"+port);

        loadOverloads();
        for await (const [msg] of socket) {
            await socket.send(onPythonMessage(msg.toString()));
        }
    })
};

ee.apiclient.setAuthToken('', 'Bearer', tocken, 3600, [], runAnalysis, false);