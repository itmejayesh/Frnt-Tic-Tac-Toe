import React, {useEffect, useId, useRef, useState} from "react";
import {
	useLocalMicrophoneTrack,
	useLocalCameraTrack,
	useRemoteUsers,
	useRemoteAudioTracks,
	usePublish,
	useJoin,
	useRemoteVideoTracks,
	useVolumeLevel,
	useClientEvent,
	LocalVideoTrack,
	LocalAudioTrack,
	RemoteAudioTrack,
} from "agora-rtc-react";
import RemoteAndLocalVolumeComponent from "./RemoteAndLocalVolumeComponent";

const VoiceCall = ({channelName, appId, agoraEngine, handleMicToggle}) => {
	const [mute, setMute] = useState(true);
	const [allUserIds, setAllUserIds] = useState([]);
	const remoteUsers = useRemoteUsers();
	const {isLoading: isLoadingMic, localMicrophoneTrack} = useLocalMicrophoneTrack();
	const {isLoading: isLoadingCam, localCameraTrack} = useLocalCameraTrack();
	const {audioTracks, isLoading: RemoteUserAudioLoading} = useRemoteAudioTracks(remoteUsers);
	const {videoTracks, isLoading: RemoteUserVideoLoading} = useRemoteVideoTracks(remoteUsers);

	usePublish([localMicrophoneTrack]);
	const {data} = useJoin({
		appid: appId,
		channel: channelName,
		token: null,
		uid: null,
	});

	const unMuteMic = (
		<svg
			fill={mute ? "#FF0000" : "rgb(34, 197, 94)"}
			height="50px"
			width="50px"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			enable-background="new 0 0 512 512"
		>
			<g>
				<g>
					<path d="m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z" />
					<path d="m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z" />
				</g>
			</g>
		</svg>
	);

	useClientEvent(agoraEngine, "volume-indicator", (volume) => {
		console.log("this is the volume", volume);
	});

	const toggleMute = () => {
		if (mute) {
			setMute(false);
		} else {
			setMute(true);
		}
	};

	useEffect(() => {
		// Update allUserIds when remoteUsers change
		const userIds = remoteUsers.map((user) => user.uid);
		setAllUserIds(userIds);
	}, [remoteUsers]);
	console.log(mute);
	const deviceLoading = isLoadingMic || isLoadingCam;
	if (deviceLoading) return <div>Loading devices...</div>;
	console.log(remoteUsers);
	return (
		<div className="flex justify-around h-[1vh]">
			{audioTracks.map((track) => (
				<>
					<RemoteAudioTrack key={track.getUserId()} play track={track} />
					{unMuteMic}
				</>
			))}
			<LocalAudioTrack play track={localMicrophoneTrack} muted={mute ? true : false} />
			<div className={`cursor-pointer flex justify-end `} onClick={toggleMute}>
				{unMuteMic}
			</div>
		</div>
	);
};

export default VoiceCall;
