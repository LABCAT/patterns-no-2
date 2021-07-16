import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import ShuffleArray from "./functions/ShuffleArray.js";

const P5Sketch = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.gridSize = 20;

        p.squareSize = 0;

        p.count = 0;

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.squareSize = p.width / p.gridSize;
            p.angleMode(p.DEGREES);
            p.rectMode(p.CENTER);
            p.background(255);
        };

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

        p.draw = () => {
            if(p.count % p.gridSize === 0 && p.count != 0){
                p.colours.push(p.colours.shift());
            }
            p.colourIndex = p.count % p.colours.length;
            const colour = p.colours[p.colourIndex];
            const xpos = (p.count % p.gridSize) * p.squareSize + (p.squareSize/2);
            const ypos = parseInt(p.count / p.gridSize) * p.squareSize; 
            
            p.noStroke();
            p.push();
            p.translate(xpos, ypos);
            p.rotate(45);
            p.fill(colour.r, colour.g, colour.b, 128);
            p.rect(0, 0, p.squareSize, p.squareSize);
            p.count++;
            p.pop();
        };


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
