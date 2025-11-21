'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './DinoGame.module.css';

const DinoGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    // Game constants
    const GRAVITY = 0.6;
    const JUMP_FORCE = -10;
    const GROUND_HEIGHT = 250;
    const DINO_X = 50;
    const OBSTACLE_SPEED = 5;
    const SPAWN_RATE = 100; // Frames between spawns

    // Game state refs (to access in loop without dependencies)
    const gameState = useRef({
        dinoY: GROUND_HEIGHT,
        dinoVelocity: 0,
        isJumping: false,
        obstacles: [] as { x: number; y: number; width: number; height: number }[],
        frame: 0,
        score: 0,
        gameActive: false,
    });

    const resetGame = () => {
        gameState.current = {
            dinoY: GROUND_HEIGHT,
            dinoVelocity: 0,
            isJumping: false,
            obstacles: [],
            frame: 0,
            score: 0,
            gameActive: true,
        };
        setIsGameOver(false);
        setScore(0);
        setGameStarted(true);
    };

    const handleJump = () => {
        if (!gameState.current.gameActive) {
            if (!gameStarted || isGameOver) {
                resetGame();
            }
            return;
        }
        if (!gameState.current.isJumping) {
            gameState.current.dinoVelocity = JUMP_FORCE;
            gameState.current.isJumping = true;
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw ground
            ctx.beginPath();
            ctx.moveTo(0, GROUND_HEIGHT + 30);
            ctx.lineTo(canvas.width, GROUND_HEIGHT + 30);
            ctx.stroke();

            if (gameState.current.gameActive) {
                // Update Dino physics
                gameState.current.dinoVelocity += GRAVITY;
                gameState.current.dinoY += gameState.current.dinoVelocity;

                if (gameState.current.dinoY > GROUND_HEIGHT) {
                    gameState.current.dinoY = GROUND_HEIGHT;
                    gameState.current.dinoVelocity = 0;
                    gameState.current.isJumping = false;
                }

                // Update Obstacles
                if (gameState.current.frame % SPAWN_RATE === 0) {
                    gameState.current.obstacles.push({
                        x: canvas.width,
                        y: GROUND_HEIGHT + 10,
                        width: 20,
                        height: 40,
                    });
                }

                gameState.current.obstacles.forEach((obs) => {
                    obs.x -= OBSTACLE_SPEED;
                });

                // Remove off-screen obstacles
                gameState.current.obstacles = gameState.current.obstacles.filter(
                    (obs) => obs.x + obs.width > 0
                );

                // Collision Detection
                const dinoRect = {
                    x: DINO_X,
                    y: gameState.current.dinoY,
                    width: 30,
                    height: 30,
                };

                for (const obs of gameState.current.obstacles) {
                    if (
                        dinoRect.x < obs.x + obs.width &&
                        dinoRect.x + dinoRect.width > obs.x &&
                        dinoRect.y < obs.y + obs.height &&
                        dinoRect.y + dinoRect.height > obs.y
                    ) {
                        gameState.current.gameActive = false;
                        setIsGameOver(true);
                        setHighScore((prev) => Math.max(prev, Math.floor(gameState.current.score)));
                    }
                }

                // Update Score
                gameState.current.score += 0.1;
                setScore(Math.floor(gameState.current.score));
                gameState.current.frame++;
            }

            // Draw Dino
            ctx.fillStyle = '#555';
            ctx.fillRect(DINO_X, gameState.current.dinoY, 30, 30);

            // Draw Obstacles
            ctx.fillStyle = '#d32f2f';
            gameState.current.obstacles.forEach((obs) => {
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent scrolling
                handleJump();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameStarted, isGameOver]);

    return (
        <div className={styles.gameContainer}>
            <div className={styles.scoreBoard}>
                <span>Score: {score}</span>
                <span>High Score: {highScore}</span>
            </div>
            <canvas
                ref={canvasRef}
                width={800}
                height={300}
                className={styles.canvas}
                onClick={handleJump}
            ></canvas>
            <div className={styles.instructions}>
                {!gameStarted
                    ? 'Press Space or Click to Start'
                    : isGameOver
                        ? 'Game Over! Press Space or Click to Restart'
                        : 'Press Space or Click to Jump'}
            </div>
        </div>
    );
};

export default DinoGame;
