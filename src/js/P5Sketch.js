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
                r: 179,
                g: 54,
                b: 160,
            },
            {
                r: 160,
                g: 179,
                b: 54,
            },
            {
                r: 54,
                g: 179,
                b: 92,
            },
            {
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

        p.circlesToDraw2 = [];

        p.squaresToDraw = [];

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

                p.squaresToDraw.push(
                    {
                        x: xpos,
                        y: ypos, 
                        colour: p.color(colour.r, colour.g, colour.b),
                    }
                );
            }
                
        }

        p.initialCircleDivider = 24;

        p.executeCueSet1 = (vars) => {
            const { currentCue, midi } = vars;
            
            if (!p.cueSet1Completed.includes(currentCue)) {
                p.cueSet1Completed.push(currentCue);
                if(currentCue % 20 === 1 && currentCue !== 1 & currentCue < 81){
                    p.initialCircleDivider = p.initialCircleDivider / 2;
                }
                const keys = midi === 36 ? ['179-54-160', '54-179-92'] : midi === 37 ? ['160-179-54', '179-64-54'] : [];
                p.circlesToDraw1 = p.circleObjects.filter(circle => {
                    return keys.includes(circle.key);
                })
            }
        };

         p.executeCueSet2 = (vars) => {
            // const { currentCue, midi } = vars;
            // if (!p.cueSet2Completed.includes(currentCue)) {
            //     p.cueSet2Completed.push(currentCue);
            // }
        };

        //https://www.sessions.edu/color-calculator/
        p.draw = () => {
            p.background(255);
            p.circlesToDraw1.forEach(circle => {
                p.drawCirle(circle);
            });

            p.squaresToDraw.forEach(square => {
                p.drawSquare(square);
            });
        };

        p.drawCirle = (circle) => {
            const colour = circle.colour;
            let alpha = 64;
            let divider = p.initialCircleDivider;
            for(let i = 0; i < 3; i++){
                colour.setAlpha(alpha - 1);
                p.noStroke();
                p.fill(colour);
                p.ellipse(circle.x + p.squareSize/2, circle.y  + p.squareSize/2, p.squareSize/divider, p.squareSize/divider);
                alpha = alpha * 2;
                divider = divider * 2;
            }
        };

        p.drawSquare = (square) => {
            const { x, y, colour } = square;
            p.push();
            p.translate(x, y);
            p.noStroke();
            p.rotate(45);
            colour.setAlpha(63);
            p.fill(colour);
            p.rect(0, 0, p.squareSize, p.squareSize);
            p.noFill();
            colour.setAlpha(127);
            p.stroke(colour);
            p.rect(0, 0, p.squareSize / 4, p.squareSize / 4);
            colour.setAlpha(181);
            p.stroke(colour);
            p.rect(0, 0, p.squareSize / 2, p.squareSize / 2);
            colour.setAlpha(255);
            p.stroke(colour);
            p.rect(0, 0, p.squareSize, p.squareSize);
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
