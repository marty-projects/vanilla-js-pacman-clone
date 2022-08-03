import { DIRECTIONS, OBJECT_TYPE } from "./setup";

export function randomMovement(position, direction, objectExtists) {
    let dir = direction;
    let nextMovePos = position + dir.movement;
    //create an array with the keys from the DIRECTIONS object
    const keys = Object.keys(DIRECTIONS);
    while (
        objectExtists(nextMovePos, OBJECT_TYPE.WALL) ||
        objectExtists(nextMovePos, OBJECT_TYPE.GHOST)
    ) {
        //get a random key from the array
        const key = keys[Math.floor(Math.random() * keys.length)];
        //set the next move
        dir = DIRECTIONS[key];
        nextMovePos = position + dir.movement;
    }
    return {nextMovePos, direction: dir};
} 