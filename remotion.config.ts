import { Config } from "@remotion/cli/config";

// Global render defaults for the project.
// Compositions render with a transparent background so they can be
// composited over footage in an editor, so we keep ProRes 4444 + alpha
// friendly settings available by default.
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuva444p10le");
Config.setCodec("prores");
Config.setProResProfile("4444");

// Quality of life.
Config.setOverwriteOutput(true);
