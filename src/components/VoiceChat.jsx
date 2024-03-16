import React, {useEffect, useState} from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const VoiceChat = ({channelName, appId}) => {
	const client = AgoraRTC.createClient({codec: "vp8", mode: "rtc"});
	const {ready, tracks} = AgoraRTC.createMicrophoneAndCameraTracks();
	const [micFound, setMicFound] = useState(true);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const checkMicrophone = async () => {
			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const microphones = devices.filter((device) => device.kind === "audioinput");
				setMicFound(microphones.length > 0);
			} catch (error) {
				console.error("Error checking microphone:", error);
				setMicFound(false); // Set micFound to false in case of error
			}
		};

		checkMicrophone();
	}, []);

	useEffect(() => {
		if (!micFound) {
			// Handle the case when microphone is not found
			console.log("Microphone not found");
		} else {
			let init = async (name, appId) => {
				client.on("user-publish", async (user, mediaType) => {
					try {
						await client.subscribe(user, mediaType);
						console.log("Subscribed successfully");
						//skip video part
						if (mediaType === "video") {
							setUsers((prevUsers) => {
								return [...prevUsers, user];
							});
						}
						if (mediaType === "audio") {
							user.audioTrack?.play();
						}
					} catch (error) {}
				});

				client.on("user-unpublished", async (user, type) => {
					console.log("Unpublished successfully", user, type);
					if (type === "audio") {
						user.audioTrack?.stop();
					}
					if (type === "video") {
						setUsers((prevUsers) => {
							return prevUsers.filter((User) => User.uid !== user.uid);
						});
					}
				});

				client.on("user-left", (user) => {
					console.log("leaving", user);
					setUsers((prevUsers) => {
						return prevUsers.filter((User) => User.uid !== user.uid);
					});
				});

				await client.join(appId, name, null, null);
				if (tracks) await client.publish([tracks[0], tracks[1]]);
			};

			if (ready && tracks) {
				console.log("init ready");
				init(channelName, appId);
			}
		}
	}, [channelName, client, ready, tracks]);

	return (
		<div>
			{micFound ? <div>Microphone found</div> : <div>Microphone not found</div>}
			<div></div>
		</div>
	);
};

export default VoiceChat;

// import React, {useEffect, useState} from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import VoiceCall from "../components/VoiceCall";

// //Initiate the Voice SDK engine

// const rtcUid = Math.floor(Math.random() * 2032);

// const VoiceChat = ({channelName, appId}) => {
// 	const client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});
// 	const [user, setUser] = useState([]);
// 	const [audioTracks, setAudioTracks] = useState({
// 		localAudioTrack: null,
// 		remoteAudioTracks: {},
// 	});

// 	const initRtc = async () => {
// 		try {
// 			await client.join(appId, channelName, null, rtcUid);
// 			audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
// 			client.publish(audioTracks.localAudioTrack);
// 		} catch (error) {
// 			console.warn(error);
// 		}
// 	};

// 	const userLeft = async () => {
// 		audioTracks.localAudioTrack.stop();
// 		audioTracks.localAudioTrack.close();
// 		client.unpublish();
// 		client.leave();
// 	};

// 	useEffect(() => {
// 		initRtc();
// 	}, []);

// 	return (
// 		<div>
// 			Voice room
// 			{user.map((user) => (
// 				<VoiceCall key={user.uid} user={user} />
// 			))}
// 		</div>
// 	);
// };

// export default VoiceChat;

// const VoiceChat = ({channelName, appId}) => {
// 	const client = useRTCClient(AgoraRTC.createClient({mode: "rtc", codec: "vp8"}));
// 	return (
// 		<AgoraRTCProvider client={client}>
// 			<VoiceCall channelName={channelName} AppId={appId} />
// 		</AgoraRTCProvider>
// 	);

// 	function VoiceCall({channelName, AppId}) {
// 		const {isLoading, localMicrophoneTrack} = useLocalMicrophoneTrack();
// 		const remoteUsers = useRemoteUsers();
// 		const {audioTracks} = useRemoteAudioTracks(remoteUsers);
// 		usePublish([localMicrophoneTrack]);
// 		useJoin({
// 			appid: appId,
// 			channelName: channelName,
// 			token: null,
// 		});

// 		const micOff = (
// 			<svg width="50px" height="50px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
// 				<title>ionicons-v5-g</title>
// 				<line
// 					x1="432"
// 					y1="400"
// 					x2="96"
// 					y2="64"
// 					style={{
// 						fill: "none",
// 						stroke: "#ffffff", // Changed stroke color to white
// 						strokeLinecap: "round",
// 						strokeMiterlimit: 10,
// 						strokeWidth: "32px",
// 					}}
// 				/>
// 				<path
// 					d="M400,240V208.45c0-8.61-6.62-16-15.23-16.43A16,16,0,0,0,368,208v32a111.68,111.68,0,0,1-2.68,24.38,2,2,0,0,0,.53,1.84l22.59,22.59a2,2,0,0,0,3.29-.72A143.27,143.27,0,0,0,400,240Z"
// 					style={{fill: "#ffffff"}} // Changed fill color to white
// 				/>
// 				<path
// 					d="M256,352A112.36,112.36,0,0,1,144,240V208.45c0-8.61-6.62-16-15.23-16.43A16,16,0,0,0,112,208v32c0,74,56.1,135.12,128,143.11V432H192.45c-8.61,0-16,6.62-16.43,15.23A16,16,0,0,0,192,464H319.55c8.61,0,16-6.62,16.43-15.23A16,16,0,0,0,320,432H272V383.11a143.08,143.08,0,0,0,52-16.22,4,4,0,0,0,.91-6.35l-18.4-18.39a3,3,0,0,0-3.41-.58A111,111,0,0,1,256,352Z"
// 					style={{fill: "#ffffff"}} // Changed fill color to white
// 				/>
// 				<path
// 					d="M257.14,48a79.66,79.66,0,0,0-68.47,36.57,4,4,0,0,0,.54,5L332.59,233a2,2,0,0,0,3.41-1.42V128.91C336,85,301,48.6,257.14,48Z"
// 					style={{fill: "#ffffff"}} // Changed fill color to white
// 				/>
// 				<path
// 					d="M179.41,215a2,2,0,0,0-3.41,1.42V239a80.89,80.89,0,0,0,23.45,56.9,78.55,78.55,0,0,0,77.8,21.19,2,2,0,0,0,.86-3.35Z"
// 					style={{fill: "#ffffff"}} // Changed fill color to white
// 				/>
// 			</svg>
// 		);

// 		useEffect(() => {
// 			audioTracks.forEach((audioTrack) => audioTrack.play());

// 			return () => {
// 				audioTracks.forEach((audioTrack) => audioTrack.stop());
// 			};
// 		}, [audioTracks]);

// 		if (isLoading) {
// 			return <div>mic is loading.....</div>;
// 		}
// 		return <>{micOff}</>;
// 	}
// };

// useEffect(() => {
// 	const initializeVoiceChat = async () => {
// 		try {
// 			const client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});
// 			client.on("user-published", async (user, mediaType) => {
// 				// Subscribe to the remote user when the SDK triggers the "user-published" event.
// 				await agoraEngine.subscribe(user, mediaType);
// 				console.log("subscribe success");
// 				eventsCallback("user-published", user, mediaType);
// 			});
// 			const uid = await client.join(appId, channelName, null, rtcUid);
// 			console.log("UID", uid);
// 			const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
// 			const [audioTrack, videoTrack] = tracks;
// 			setLocalTracks(tracks);
// 			setUser((prevUser) => [
// 				...prevUser,
// 				{
// 					uid,
// 					audioTrack,
// 					videoTrack,
// 				},
// 			]);

// 			client.publish(tracks);
// 		} catch (error) {
// 			console.error("Error joining channel:", error);
// 			// Handle error, perhaps show an error message to the user
// 		}
// 	};
// 	initializeVoiceChat();
// 	return () => {
// 		for (let localTracks of localTracks) {
// 			localTracks.stop();
// 			localTracks.close();
// 		}
// 		client.off("user-published");
// 		client.off();
// 		client.unpublish(tracks).then(() => client.leave());
// 	};
// }, [appId, channelName]);
