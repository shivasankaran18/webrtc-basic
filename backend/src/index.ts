import { WebSocketServer,WebSocket } from "ws";

const wss=new WebSocketServer({port:6969});

let senderSocket:null | WebSocket=null;
let receiverSocket:null | WebSocket=null;


wss.on('connection',(ws)=>{
    ws.on('error',(err:Error)=>{
        console.log("erro")
    })

    ws.on('message',(message:any)=>{
        let data=JSON.parse(message)
        console.log(data)
        
        if(data.type==='sender')
        {
            senderSocket=ws;
        }

        else if(data.type==='receiver')
        {
            receiverSocket=ws;

        }

        else if(data.type=='createOffer')
        {
            console.log("offersent")
            console.log(receiverSocket==null)
            receiverSocket?.send(JSON.stringify({type:"createOffer",sdp:data.sdp}))

        }

        else if(data.type=='createAnswer')
        {
            
            console.log("ii")
            senderSocket?.send(JSON.stringify({type:"createAnswer",sdp:data.sdp}))

        }

        else if(data.type==='iceCandidate')
        {
            if(ws==senderSocket)
            {
                receiverSocket?.send(JSON.stringify({type:"iceCandidate",candidate:data.candidate}))

            }
            else{
                senderSocket?.send(JSON.stringify({type:"iceCandidate",candidate:data.candidate}))
            }
        }

        
    })

    console.log("hello ")
})

