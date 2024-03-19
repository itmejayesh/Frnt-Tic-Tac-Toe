import React from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import {useRTCClient, AgoraRTCProvider} from "agora-rtc-react";
import VoiceCall from "@/components/VoiceCall";

const VoiceChat = ({channelName, appId}) => {
	const agoraEngine = useRTCClient(AgoraRTC.createClient({codec: "vp8", mode: "rtc"}));

	return (
		<AgoraRTCProvider client={agoraEngine}>
			<VoiceCall channelName={channelName} appId={appId} agoraEngine={agoraEngine} />
		</AgoraRTCProvider>
	);
};

export default VoiceChat;
