import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import ShuffleArray from "./functions/ShuffleArray.js";
import audio from '../audio/patterns-no-2.ogg';
import cueSet1 from "./cueSet1.js";
import cueSet2 from "./cueSet2.js";

const P5Sketch = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.cueSet1Completed = [];

        p.cueSet2Completed = [];

        p.gridSize = 20;

        p.squareSize = 0;

        p.count = 0;

        p.colours = [
            {
                id: 'colour1',
                r: 179,
                g: 54,
                b: 160,
            },
            {
                id: 'colour2',
                r: 160,
                g: 179,
                b: 54,
            },
            {
                id: 'colour3',
                r: 54,
                g: 179,
                b: 92,
            },
            {
                id: 'colour4',
                r: 179,
                g: 64,
                b: 54,
            }
        ];

        p.colourIndex = 0;

        p.preload = () => {
            p.song = p.loadSound(audio);
        }

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.squareSize = p.width / p.gridSize;
            p.angleMode(p.DEGREES);
            p.rectMode(p.CENTER);
            p.background(255);
            p.frameRate(30);
            p.loadObjectArrays();

            for (let i = 0; i < cueSet1.length; i++) {
              let vars = {
                currentCue: i + 1,
                duration: cueSet1[i].duration,
                time: cueSet1[i].time,
                midi: cueSet1[i].midi,
              };
              p.song.addCue(cueSet1[i].time, p.executeCueSet1, vars);
            }

            for (let i = 0; i < cueSet2.length; i++) {
              let vars = {
                currentCue: i + 1,
                duration: cueSet2[i].duration,
                time: cueSet2[i].time,
                midi: cueSet2[i].midi,
              };
              p.song.addCue(cueSet2[i].time, p.executeCueSet2, vars);
            }
        };

        p.circleObjects = [];
        
        p.circlesToDraw1 = [];

        p.squareObjects = [];

        p.squaresToDraw1 = [];

        p.squaresToDraw2 = [];

        p.squaresToDraw3 = [];

        p.loadObjectArrays = () => {
            let iterations = parseInt(p.height / p.squareSize + 1) * 20;

            for(let i = 0; i < iterations; i++){
                if(i % p.gridSize === 0 && i !== 0){
                    p.colours.push(p.colours.shift());
                }
                const xpos = (i % p.gridSize) * p.squareSize + (p.squareSize/2);
                const ypos = parseInt(i / p.gridSize) * p.squareSize; 
                p.colourIndex = i % p.colours.length;
                const colour = p.colours[p.colourIndex];
                if(i % p.gridSize !== 19) {
                    p.circleObjects.push(
                        {
                            key: colour.r + '-' + colour.g + '-' + colour.b,
                            x: xpos,
                            y: ypos, 
                            colour: p.color(colour.r, colour.g, colour.b),
                        }
                    );
                }

                p.squareObjects.push(
                    {
                        key: colour.r + '-' + colour.g + '-' + colour.b,
                        x: xpos,
                        y: ypos, 
                        colour: p.color(colour.r, colour.g, colour.b),
                    }
                );
            }   

            p.circleObjects = ShuffleArray(p.circleObjects);
            p.squareObjects = ShuffleArray(p.squareObjects);
        }

        p.sqaureDivider = 32;

        p.executeCueSet1 = (vars) => {
            const { currentCue, midi } = vars;
            
            if (!p.cueSet1Completed.includes(currentCue)) {
                p.cueSet1Completed.push(currentCue);
                // console.log(currentCue);
                // console.log(vars.time);
                switch (currentCue) {
                    case 21:
                        p.sqaureDivider = 16;
                        break;
                    case 47:
                        p.sqaureDivider = 8;
                        break;
                    case 67:
                        p.sqaureDivider = 4;
                        break;
                    case 93:
                        p.sqaureDivider = 2;
                        break;
                    case 193:
                        p.sqaureDivider = 1;
                        break;
                    default:
                        break;
                }
                const keys = midi === 36 ? ['179-54-160', '54-179-92'] : midi === 37 ? ['160-179-54', '179-64-54'] : [];
                p.squaresToDraw1 = currentCue === cueSet1.length ? p.squareObjects : p.squareObjects.filter(square => {
                    return keys.includes(square.key);
                })
            }
        };

        p.executeCueSet2 = (vars) => {
            const { currentCue } = vars, 
                notesPerLoop = currentCue <= 36 ? 36 : 38,
                squaresPerCue = parseInt(p.squareObjects.length / notesPerLoop);
            let modulo = currentCue % notesPerLoop;
            if(currentCue > 36) {
                modulo = (currentCue + 2) % notesPerLoop;
            }
            if (!p.cueSet2Completed.includes(currentCue)) {
                p.cueSet2Completed.push(currentCue);
                const start = modulo > 0 ? (modulo - 1) * squaresPerCue : (notesPerLoop - 1) * squaresPerCue;
                const end = modulo === 0 ? p.squareObjects.length : start + squaresPerCue;
                if(currentCue <= 36){
                    p.squaresToDraw2 = p.squaresToDraw2.concat(p.squareObjects.slice(start, end))
                }
                else if(currentCue > 74){
                    p.squaresToDraw3 = p.squaresToDraw3.concat(p.squareObjects.slice(start, end))
                }
                else if(currentCue > 36 && currentCue <= 74){
                    p.circlesToDraw1 = p.circlesToDraw1.concat(p.circleObjects.slice(start, end))
                }

                if (modulo === 0) {
                    p.squareObjects = ShuffleArray(p.squareObjects);
                }
            }
        };

        p.draw = () => {
            p.background(255);
            p.circlesToDraw1.forEach(circle => {
                p.drawCirle(circle);
            });

            p.squaresToDraw1.forEach(square => {
                p.drawSquare(square, 2);
            });

            p.squaresToDraw2.forEach(square => {
                p.drawSquare(square, 1);
            });
            
            p.squaresToDraw3.forEach(square => {
                p.drawSquare(square, 3);
            });
        };

        p.drawCirle = (circle) => {
            const colour = circle.colour;
            let alpha = 64;
            let divider = 3;
            for(let i = 0; i < 3; i++){
                colour.setAlpha(alpha - 1);
                p.noStroke();
                p.fill(colour);
                p.ellipse(circle.x + p.squareSize/2, circle.y  + p.squareSize/2, p.squareSize / divider, p.squareSize / divider);
                alpha = alpha * 2;
                divider = divider * 2;
            }
        };

        p.drawSquare = (square, squareOption) => {
            const { x, y, colour } = square;
            p.noStroke();
            p.noFill();
            p.push();
            p.translate(x, y);
            p.rotate(45);
            switch (squareOption) {
                case 2:
                    colour.setAlpha(127);
                    p.stroke(colour);
                    p.rect(0, 0, p.squareSize / 4 / p.sqaureDivider, p.squareSize / 4 / p.sqaureDivider);
                    colour.setAlpha(181);
                    p.stroke(colour);
                    p.rect(0, 0, p.squareSize / 2 / p.sqaureDivider, p.squareSize / 2 / p.sqaureDivider);
                    break;
                case 3:
                    colour.setAlpha(63);
                    p.fill(colour);
                    p.rect(0, 0, p.squareSize, p.squareSize);
                    break;
                default:
                    colour.setAlpha(255);
                    p.stroke(colour);
                    p.rect(0, 0, p.squareSize, p.squareSize);       
                    break;
            }
            p.pop();
        }

        p.mousePressed = () => {
            if (p.song.isPlaying()) {
                p.song.pause();
            } else {
                if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                }
                p.canvas.removeClass('fade-out');
                p.song.play();
            }
        };

        p.creditsLogged = false;

        p.logCredits = () => {
            if (!p.creditsLogged && parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                p.creditsLogged = true;
                console.log(
                    'Music By: http://labcat.nz/',
                    '\n',
                    'Animation By: https://github.com/LABCAT/patterns-no-2',
                    '\n',
                    'Code Inspiration: https://editor.p5js.org/Jaesar/sketches/C4kDjzbq6',
                );
                p.song.stop();
            }
        }

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.squareSize = p.width < 320 ? 20 : p.width / 20;
            p.redraw();
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
        </div>
    );
};

export default P5Sketch;
