import React, { Component } from 'react';
import images from '../../data/images';

import './sliderwrapper.css';
import './slider-container.css';

class SliderWrapper extends Component {
    constructor(props) {
        super(props);
        this.imageContainer = React.createRef();
        this.sliderContainer = React.createRef();

        this.state = {
            currentIndex: 0,
            availableIndex: null,
            position: 0,
            visibleContainerWidth: null,
            allImagesWidth: null,
        };
    }

    componentDidMount() {
        this.calculateIndexAndWidth();
    }

    goBack = (event) => {
        const {
            currentIndex, position, visibleContainerWidth,
        } = this.state;
        event.preventDefault();
        let newPosition = position + visibleContainerWidth;
        const newIndex = currentIndex - 1;

        // Check if newindex is 0 then position should be zero, adjustment if remainder is smaller than container width
        if (newIndex === 0) {
            newPosition = 0;
        }

        this.setState({
            position: newPosition,
            currentIndex: newIndex,
        });
    }

    goForward = (event) => {
        const {
            currentIndex, position, visibleContainerWidth, allImagesWidth,
        } = this.state;
        event.preventDefault();

        let newPosition = position - visibleContainerWidth;
        // Check if remainder of container is smaller than the new pos and adjust the container to the remainder
        if ((allImagesWidth + newPosition) < visibleContainerWidth) {
            newPosition = Math.abs(allImagesWidth - visibleContainerWidth) * -1;
        }
        const newIndex = currentIndex + 1;

        this.setState({
            position: newPosition,
            currentIndex: newIndex,
        });
    }

    calculateIndexAndWidth() {
        const imageWidth = this.imageContainer.getBoundingClientRect().width;
        const visibleContainerWidth = this.sliderContainer.getBoundingClientRect().width;
        const allImagesWidth = imageWidth * images.length;
        const availableIndex = Math.ceil(allImagesWidth / visibleContainerWidth) - 1;

        this.setState({
            availableIndex,
            visibleContainerWidth,
            allImagesWidth,
        });
    }

    render() {
        const { position, availableIndex, currentIndex } = this.state;
        const remainingCirclesLeft = currentIndex;
        const remainingCirclesRight = availableIndex - currentIndex;
        return (
            <div className="sliderwrapper">
                {currentIndex !== 0 && (
                    <a href="#back" onClick={this.goBack} className="sliderwrapper__link sliderwrapper__link--back">
                        <span aria-label="back" role="img">⬅️</span>
                    </a>
                )}
                <ul style={{ transform: `translateX(${position}px)` }} ref={ref => this.sliderContainer = ref} className="slider-container">
                    {images.map(image => (
                        <li ref={ref => this.imageContainer = ref} key={image.id} className="slider-container__image-container">
                            <img alt={image.alt} src={image.src} />
                        </li>
                    ))}
                </ul>
                {currentIndex !== availableIndex && (
                    <a href="#forward" onClick={this.goForward} className="sliderwrapper__link sliderwrapper__link--forward">
                        <span aria-label="forward" role="img">➡️</span>
                    </a>)}
                <div className="sliderwrapper__circle-container">
                    {Array(remainingCirclesLeft).fill(<span role="img" aria-label="empty-circle" className="sliderwrapper__circle">○</span>)}
                    <span role="img" aria-label="filled-circle" className="sliderwrapper__circle">●</span>
                    {Array(remainingCirclesRight).fill(<span role="img" aria-label="empty-circle" className="sliderwrapper__circle">○</span>)}
                </div>
            </div>
        );
    }
}

export default SliderWrapper;
