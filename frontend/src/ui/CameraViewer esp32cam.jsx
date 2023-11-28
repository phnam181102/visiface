import { useState } from 'react';
import PropTypes from 'prop-types';
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

const VideoStream = styled.img`
    border-radius: var(--border-radius-tiny);
    max-width: 100%;
    max-height: 100%;
    height: 100%;
    width: 100%;
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
    const [streaming, setStreaming] = useState(true);
    const [image, setImage] = useState('');

    const handleStream = (e) => {
        e.preventDefault();
        setStreaming(true);
    };

    const captureImage = (e) => {
        e.preventDefault();
        const x = Math.floor(Math.random() * 100 + 1);

        // Fetch base64 image data from your ESP32 server
        fetch(`http://192.168.1.32/base64?${x}`)
            .then((response) => response.json())
            .then((data) => {
                setImage(data.image);
                setStreaming(false);
                // Pass the base64 image data to the parent component
                onPhotoCapture(data.image);
            })
            .catch((error) => {
                console.error('Error fetching base64 data:', error);
            });
    };

    return (
        <div>
            <Background>
                {streaming ? (
                    <VideoStream
                        src="http://192.168.1.32/mjpeg/1"
                        alt="Camera Stream"
                    />
                ) : (
                    <CapturedImage
                        src={`data:image/jpeg;base64,${image}`}
                        alt="Captured Image"
                    />
                )}
                <ButtonWrapper>
                    {!streaming ? (
                        <Button
                            variation="secondary"
                            onClick={handleStream}
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

CameraViewer.propTypes = {
    onPhotoCapture: PropTypes.func.isRequired,
};

export default CameraViewer;
