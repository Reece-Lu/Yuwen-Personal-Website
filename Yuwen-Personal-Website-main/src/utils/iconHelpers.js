export const getIconByName = (name) => {
    try {
        return require(`../assets/icons/${name}.png`);
    } catch (error) {
        console.error(`Icon ${name} not found!`);
        return null;
    }
};
