const wait = async (time: number = 1000) =>
    await new Promise((resolve) => {
        console.log(`Sleeping ${time}ms...`);
        setTimeout(resolve, time);
    });

export default wait;
