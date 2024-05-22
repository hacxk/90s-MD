module.exports = (Command) => {
    Command({
        cmd: ['menu', 'help'], // Define multiple commands as an array
        desc: 'All Commands',
        react: "📜", // Reaction emoji
        type: 'bot',
        handler: async (m, sock, commands) => { // Pass 'commands' array as an argument
            let menuText = "📜 All Commands:\n\n";

            // Object to store commands categorized by their type
            const commandTypes = {};

            // Iterate over commands to categorize them
            commands.forEach(command => {
                if (!commandTypes[command.type]) {
                    commandTypes[command.type] = [];
                }
                commandTypes[command.type].push(command);
            });

            // Iterate over categorized commands to construct menu text
            for (const [type, commandsOfType] of Object.entries(commandTypes)) {
                menuText += `📌 ${type}:\n`;
                commandsOfType.forEach(command => {
                    menuText += `  - ${command.desc}\n`;
                });
                menuText += "\n";
            }

            // Send the menu text
            await sock.sendMessage(m.key.remoteJid, { text: menuText });
        }
    });
};
