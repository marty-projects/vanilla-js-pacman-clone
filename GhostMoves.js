import { DIRECTIONS, OBJECT_TYPE } from "./setup";

//primitive random movement
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
        //set the new direction
        dir = DIRECTIONS[key];
        //set the next move
        nextMovePos = position + dir.movement;
    }
    return {nextMovePos, direction: dir};
} 