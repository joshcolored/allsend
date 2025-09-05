import Peer from "peer-lite";
import type { Socket } from "socket.io-client";
import { get } from "svelte/store";
import {
  connectedDevices,
  connectedPeers,
  currentTransferId,
  deviceInfo,
  initallyConnectedDevices,
  receivingFileBufferList,
  receivingList,
} from "../store/store";
import commandInterreter from "./commandInterpreter";
import { showToast } from "./misc";

const chunkSize = 16384;

const SEND_SIGNALLING_OFFER = "transfer-offer";
const SEND_SIGNALLING_ANSWER = "transfer-answer";
const SEND_ICE_CANDIDATES = "transfer-ice";
const SENDING_CHANNEL = "send";

// ✅ ICE server config (STUN + TURN)
const ICE_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },

    // ⚠️ Optional TURN (replace with your own TURN server for production)
    // {
    //   urls: "turn:your-turn-server.com:3478",
    //   username: "user",
    //   credential: "pass",
    // },
  ],
};

const sendOffer = (
  socket: Socket,
  from: string,
  to: string,
  data: RTCSessionDescriptionInit
) => {
  socket.emit(SEND_SIGNALLING_OFFER, from, to, data);
};

const sendAnswer = (
  socket: Socket,
  from: string,
  to: string,
  data: RTCSessionDescriptionInit
) => {
  socket.emit(SEND_SIGNALLING_ANSWER, from, to, data);
};

const sendICEcandidates = (
  socket: Socket,
  from: string,
  to: string,
  candidates: RTCIceCandidate[]
) => {
  socket.emit(SEND_ICE_CANDIDATES, from, to, candidates);
};

const addDeviceToConnectedList = (deviceID: string) => {
  var $temp = get(initallyConnectedDevices);
  $temp.push(deviceID);
  initallyConnectedDevices.set($temp);
};

const addPeerToConnectedList = (deviceID: string, peer: Peer) => {
  var $temp = get(connectedPeers);
  $temp.set(deviceID, peer);
  connectedPeers.set($temp);
};

const removeDeviceFromConnectedList = (deviceID: string) => {
  var $initialDevices = get(initallyConnectedDevices);
  var $connectedPeers = get(connectedPeers);
  var $connectedDevices = get(connectedDevices);
  var info = $connectedDevices.get(deviceID);
  try {
    showToast(
      "Disconnected from " + info.name + " " + info.deviceType,
      "error"
    );
    $initialDevices.splice($initialDevices.indexOf(deviceID), 1);
    $connectedPeers.delete(deviceID);
    $connectedDevices.delete(deviceID);
    initallyConnectedDevices.set($initialDevices);
    connectedPeers.set($connectedPeers);
    connectedDevices.set($connectedDevices);
  } catch {
    console.log("Error");
  }
};

const handleData = (
  peer: Peer,
  deviceID: string,
  source: "outgoing" | "incoming",
  data: string | ArrayBufferView | ArrayBuffer | Blob
) => {
  if (source === "outgoing") {
    return;
  }

  if (typeof data === "string") {
    commandInterreter(data, deviceID);
  } else {
    var $fileBuffers = get(receivingFileBufferList);
    var $receivingProgresses = get(receivingList);

    var requiredID = get(currentTransferId);

    var fileBuffer = $fileBuffers.get(requiredID);
    fileBuffer.push(data);
    $fileBuffers.set(requiredID, fileBuffer);
    receivingFileBufferList.set($fileBuffers);

    var receivingInfo = $receivingProgresses.get(requiredID);
    receivingInfo.receivedSize += chunkSize;

    if (receivingInfo.receivedSize >= receivingInfo.size) {
      receivingInfo.receivedSize = receivingInfo.size;
    }

    $receivingProgresses.set(requiredID, receivingInfo);
    receivingList.set($receivingProgresses);

    peer.send(
      JSON.stringify({
        command: "sentSize",
        action: { id: requiredID, size: receivingInfo.receivedSize },
      }),
      SENDING_CHANNEL
    );
  }
};

const createOfferingPeer = async (deviceID: string, socket: Socket) => {
  const peer = new Peer({
    enableDataChannels: true,
    channelLabel: SENDING_CHANNEL,
    config: ICE_CONFIG, // ✅ add ICE config
  });

  peer.on("signal", (data) => {
    sendOffer(socket, socket.id, deviceID, data);
  });

  peer.on("onicecandidates", (data) => {
    sendICEcandidates(socket, socket.id, deviceID, data);
  });

  peer.on("connected", () => {
    addDeviceToConnectedList(deviceID);
  });

  peer.on("channelOpen", ({ channel }) => {
    if (channel.label == SENDING_CHANNEL) {
      peer.send(
        JSON.stringify({ command: "info", action: get(deviceInfo) }),
        SENDING_CHANNEL
      );
    }
  });

  peer.on("channelClosed", ({ channel }) => {
    if (channel.label == SENDING_CHANNEL) {
      removeDeviceFromConnectedList(deviceID);
    }
  });

  peer.on("channelData", ({ channel, source, data }) => {
    handleData(peer, deviceID, source, data);
  });

  peer.start();
  addPeerToConnectedList(deviceID, peer);
};

const createAnsweringPeer = async (deviceID: string, socket: Socket) => {
  const peer = new Peer({
    enableDataChannels: true,
    config: ICE_CONFIG, // ✅ add ICE config
  });

  peer.on("signal", (data) => {
    sendAnswer(socket, socket.id, deviceID, data);
  });

  peer.on("onicecandidates", (data) => {
    sendICEcandidates(socket, socket.id, deviceID, data);
  });

  peer.on("connected", () => {
    addDeviceToConnectedList(deviceID);
  });

  peer.on("channelOpen", ({ channel }) => {
    if (channel.label == SENDING_CHANNEL) {
      peer.send(
        JSON.stringify({ command: "info", action: get(deviceInfo) }),
        SENDING_CHANNEL
      );
    }
  });

  peer.on("channelClosed", ({ channel }) => {
    if (channel.label == SENDING_CHANNEL) {
      removeDeviceFromConnectedList(deviceID);
    }
  });

  peer.on("channelData", ({ channel, source, data }) => {
    handleData(peer, deviceID, source, data);
  });

  addPeerToConnectedList(deviceID, peer);
};

export { createOfferingPeer, createAnsweringPeer };
