# Frequently Asked Questions (FAQ)

## General Questions

### What is Foxlayne?
Foxlayne is a desktop application that helps you track your progress in the RuneScape Catalyst League. It provides real-time data from the RuneScape API and offers a clean, modern interface for monitoring your task completion.

### Is Foxlayne free?
Yes! Foxlayne is completely free and open source. You can download, use, and even modify the code without any cost.

### What platforms does Foxlayne support?
Foxlayne runs on:
- **Windows** 10 and later
- **macOS** 10.14 and later  
- **Linux** (Ubuntu 18.04+ and similar distributions)

## Installation Questions

### Do I need to install anything else?
No! Foxlayne is a standalone application. Just download and run the installer for your platform.

### Why is my antivirus flagging the download?
Some antivirus software may flag Electron applications as potentially unwanted. This is a false positive. Foxlayne is safe to use and the source code is publicly available for inspection.

### Can I run Foxlayne without installing it?
Yes! On Windows, you can use the portable version. On Linux, you can run the AppImage directly without installation.

### How do I update Foxlayne?
- **Windows**: The app checks for updates automatically, or download from the releases page
- **macOS**: Download the latest DMG and replace the app in Applications
- **Linux**: Download the latest AppImage/DEB and replace the old version

## Usage Questions

### How do I search for my RuneScape character?
Click the search box in the top-right corner and enter your exact RuneScape username. The app will fetch your data from the RuneScape API.

### Why can't I find my character?
- **Check spelling**: Make sure the username is exactly correct
- **Try different formats**: Some usernames have special characters or spaces
- **API availability**: The RuneScape API might be temporarily down
- **Account status**: Make sure your account is active and public

### How often does the data update?
- **Task Tracker**: Updates when you search for a player
- **Clan Progress**: Updates automatically every 10 minutes in the background
- **Smart caching**: Uses 1-hour cache for league progress, 30-minute cache for clan members
- **Rate limiting**: Prevents API overload with intelligent request spacing

### Can I track multiple characters?
Currently, you can only view one character at a time. You can switch between characters by searching for different usernames.

### How does the League Clan Progress feature work?
The League Clan Progress feature shows your entire clan's progress in the Catalyst League:
- **Automatic clan detection**: When you search for your player, it automatically loads your clan
- **Live updates**: See each clan member's progress as it loads
- **Background refresh**: Data updates automatically every 10 minutes
- **Smart caching**: Uses intelligent caching to reduce API calls

### What if the RuneScape API is down?
If the API is unavailable, you can still use the app in manual tracking mode. You'll need to manually mark tasks as complete, but the app will remember your progress.

## Technical Questions

### What technology does Foxlayne use?
Foxlayne is built with:
- **Frontend**: React, TypeScript, Tailwind CSS
- **Desktop**: Electron
- **Data**: RuneScape's official API

### Is my data secure?
Yes! Foxlayne:
- Only connects to official RuneScape APIs
- Doesn't store or transmit personal information
- Caches data locally on your device
- Is open source and auditable

### Does Foxlayne use my RuneScape login?
No! Foxlayne only uses RuneScape's public API, which doesn't require your login credentials. It accesses the same data that's publicly available on the RuneScape website.

### Can I run Foxlayne on a server?
Foxlayne is designed as a desktop application. While technically possible to run on a server, it's not recommended and not supported.

## Troubleshooting

### The app won't start
1. **Check system requirements**: Ensure your OS version is supported
2. **Try running as administrator** (Windows) or with `sudo` (Linux)
3. **Check antivirus software**: It might be blocking the app
4. **Reinstall**: Download and install again

### Data isn't loading
1. **Check internet connection**: Ensure you're connected to the internet
2. **Try a different character**: Test with another username
3. **Restart the app**: Close and reopen Foxlayne
4. **Check RuneScape status**: The API might be down

### The app is running slowly
1. **Close other applications**: Free up system resources
2. **Check system requirements**: Ensure adequate RAM and CPU
3. **Use filters**: Hide completed tasks to reduce load
4. **Restart the app**: Close and reopen for a fresh start

### I'm getting error messages
Common errors and solutions:
- **"Player not found"**: Check username spelling and try again
- **"API unavailable"**: Wait a few minutes and try again
- **"Network error"**: Check your internet connection
- **"Permission denied"**: Try running as administrator (Windows) or with `sudo` (Linux)
- **"Rate limited"**: The app will automatically retry with delays
- **"Clan not found"**: Make sure your player is in a clan and the clan name is correct

### Clan Progress issues
- **"No clan data"**: Your player might not be in a clan, or the clan name mapping needs to be updated
- **"Slow loading"**: Large clans take time to load - the app processes members in batches
- **"Missing members"**: Some clan members might not have league data available
- **"Pinned component not working"**: Make sure you've searched for your own player first

## Development Questions

### Can I contribute to Foxlayne?
Absolutely! Foxlayne is open source. You can:
- **Report bugs**: Create issues on GitHub
- **Suggest features**: Propose new functionality
- **Submit code**: Contribute improvements
- **Improve documentation**: Help others learn to use the app

### Can I modify Foxlayne for my own use?
Yes! The MIT license allows you to modify and distribute Foxlayne for any purpose, including commercial use.

## Legal Questions

### Is Foxlayne affiliated with Jagex?
No, Foxlayne is an independent project and is not affiliated with Jagex or RuneScape. It's a community-created tool.

### Does using Foxlayne violate RuneScape's terms of service?
No, Foxlayne only uses RuneScape's public API, which is designed for third-party applications. It doesn't interact with the game client or use any prohibited methods.

### Can I use Foxlayne for commercial purposes?
Yes, the MIT license allows commercial use. However, you cannot claim ownership of the RuneScape data or API.

## Still Have Questions?

If your question isn't answered here:

1. **Check the [User Guide](user-guide.md)** for detailed usage instructions
2. **Visit the [GitHub Issues](https://github.com/yourusername/foxlayne/issues)** to see if others have asked the same question
3. **Create a new issue** with your question
4. **Join the community** discussions in the repository

---

**Happy tracking!** 🦊


