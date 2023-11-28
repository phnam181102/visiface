import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { HiCamera } from 'react-icons/hi2';
import { TbReload } from 'react-icons/tb';

import Button from './Button';

const Background = styled.div`
    position: relative;
    width: 100%;
    height: 380px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--border-radius-sm);
    border: 3px solid var(--color-grey-200);
    background-color: #000;
`;

const VideoStream = styled.video`
    border-radius: var(--border-radius-tiny);
    max-width: 100%;
    max-height: 100%;
    height: 100%;
    width: 100%;
    transform: scaleX(-1);
    object-fit: cover;
`;

const CapturedImage = styled.img`
    max-width: 100%;
    max-height: 100%;
    height: 100%;
    width: 100%;
    object-fit: cover;
`;

const ButtonWrapper = styled.div`
    position: absolute;
    bottom: 20px;
    right: 20px;
`;

const CameraViewer = ({ onPhotoCapture }) => {
    const [videoStream, setVideoStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        startVideo();
    }, []);

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            videoRef.current.srcObject = stream;
            setCapturedImage(null);
            setVideoStream(stream);
        } catch (error) {
            console.error('Error accessing video:', error);
        }
    };

    const captureImage = (e) => {
        e.preventDefault();
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.scale(-1, 1);
            ctx.drawImage(
                videoRef.current,
                -canvas.width,
                0,
                canvas.width,
                canvas.height
            );

            const base64Image = canvas.toDataURL('image/jpeg');
            setCapturedImage(base64Image);
            onPhotoCapture(base64Image.split(',')[1]);

            // Stop video stream
            if (videoStream) {
                videoStream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
        }
    };

    const resetCapture = (e) => {
        e.preventDefault();
        setCapturedImage(null);
        startVideo();
    };

    return (
        <div>
            <Background>
                {capturedImage ? (
                    <CapturedImage src={capturedImage} alt="Captured" />
                ) : (
                    <VideoStream ref={videoRef} autoPlay playsInline />
                )}
                <ButtonWrapper>
                    {capturedImage ? (
                        <Button
                            variation="secondary"
                            onClick={resetCapture}
                            size="medium"
                        >
                            <TbReload />
                        </Button>
                    ) : (
                        <Button
                            variation="secondary"
                            size="medium"
                            onClick={captureImage}
                        >
                            <HiCamera />
                        </Button>
                    )}
                </ButtonWrapper>
            </Background>
        </div>
    );
};

export default CameraViewer;
