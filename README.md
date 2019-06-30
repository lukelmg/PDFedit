Image hosting in glitch
=================

I made this code to make an example of how to make a image hosting in glitch for this support question: [Image Hosting in Glitch](https://support.glitch.com/t/image-hosting-in-glitch/12188).

Glitch restrictions
------------
- Projects have a limit of 200MB of disk space in the container. The contents of your project's '/tmp' directory don't count towards that total, but those files are removed when the project restarts. By default your Node.js modules don't count towards that total - there's a separate 1GB limit for nNode modules. Plus, there's an additional 512MB of assets storage space.
- Projects are limited to 4000 requests per hour (subsequent requests will return a 429 "Too Many Requests" response).
- [read more...](https://glitch.com/help/restrictions/)


Author: [ElBort](https://glitch.com/@ElBort)
