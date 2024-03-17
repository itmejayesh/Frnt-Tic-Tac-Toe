const RemoteAndLocalVolumeComponent = ({agoraEngine, remoteUsers}) => {
	const numberOfRemoteUsers = remoteUsers.length;
	const remoteUser = remoteUsers[numberOfRemoteUsers - 1];

	const handleLocalAudioVolumeChange = (evt) => {
		const volume = parseInt(evt.target.value);
		console.log("Volume of local audio:", volume);
		agoraEngine.localMicrophoneTrack?.setVolume(volume);
	};

	const handleRemoteAudioVolumeChange = (evt) => {
		if (remoteUser) {
			const volume = parseInt(evt.target.value);
			console.log("Volume of remote audio:", volume);
			remoteUser.audioTrack?.setVolume(volume);
		} else {
			console.log("No remote user in the channel");
		}
	};

	return (
		<>
			<div>
				<label>Local Audio Level:</label>
				<input
					type="range"
					min="0"
					max="100"
					step="1"
					onChange={handleLocalAudioVolumeChange}
				/>
			</div>
			<div>
				<label>Remote Audio Level:</label>
				<input
					type="range"
					min="0"
					max="100"
					step="1"
					onChange={handleRemoteAudioVolumeChange}
				/>
			</div>
		</>
	);
};

export default RemoteAndLocalVolumeComponent;
