const fs = require('fs');
const path = require('path');
require('esm')(module);
require('../../Config');

const commands = [];
let commandPrefix = global.botSettings.botPrefix[0]; // Set your desired command prefix here

function Command({ cmd, desc, react, type, handler }) {
    commands.push({ cmd, desc, react, type, handler });
}

async function handleCommand(m, sock) {
    try {
        const textMessage = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
        const matchedCommand = commands.find(command => {
            if (Array.isArray(command.cmd)) {
                return command.cmd.some(cmd => textMessage.startsWith(commandPrefix + cmd));
            } else {
                return textMessage.startsWith(commandPrefix + command.cmd);
            }
        });
        if (matchedCommand) {
            await matchedCommand.handler(m, sock, commands);
            if (matchedCommand.react) {
                await sock.sendMessage(m.key.remoteJid, { react: { text: matchedCommand.react, key: m.key } });
            }
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Function to load all commands from the Plugin folder
async function loadCommandsFromFolder(folderPath) {
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    let loadedCount = 0;
    const totalFiles = commandFiles.length;
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const commandModule = require(filePath); // Use require synchronously
        if (typeof commandModule === 'function') {
            commandModule(Command);
            loadedCount++;
            const percentage = ((loadedCount / totalFiles) * 100).toFixed(0);
            // ANSI escape codes for green color and bold style
            const greenBold = '\x1b[32;1m';
            // Reset ANSI escape code
            const reset = '\x1b[0m';
            // Emoji
            const emoji = '📂'; // You can choose any emoji you like
            console.log(`${greenBold}${emoji} Loaded percentage: ${percentage}% (${loadedCount}/${totalFiles}) ${reset}`);
        }
    }
}


module.exports = { Command, handleCommand, loadCommandsFromFolder, commands };
