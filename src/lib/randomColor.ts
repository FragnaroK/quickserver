export default function randomColor() {
    return '#000000'.replace(/0/g, () => (8 + ~~(Math.random() * 8)).toString(16));
}
