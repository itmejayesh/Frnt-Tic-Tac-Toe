import React, {useEffect, useRef} from "react";

const VoiceCall = ({user}) => {
	const ref = useRef();
	useEffect(() => {
		if (user.videoTrack) {
			user.videoTrack.play(ref.current);
		}
	}, [user.videoTrack]);

	return (
		<div>
			UID:{user.uid}
			<div ref={ref} className="h-10 w-10"></div>
		</div>
	);
};

export default VoiceCall;
