import React, { useState, useRef } from "react";
import { FaBars } from "react-icons/fa";

const Editor = () => {
  const [scenes, setScenes] = useState([
    {
      id: 1,
      title: "EXT. SOMEWHERE - DAY",
      lines: ["Click here to type your scene content..."],
      characterName: []
    },
  ]);
  const inputRefs = useRef({}); // Store references to input elements
  

  const addNewScene = () => {
    const newScene = {
      id: scenes.length + 1,
      title: "EXT. NEW SCENE - DAY",
      lines: ["Click here to type your scene content..."],
    };
    setScenes([...scenes, newScene]);
  };

const handleKeyDown = (event, sceneIndex, lineIndex) => {
  const scene = scenes[sceneIndex];

  if (event.key === "Enter") {
    event.preventDefault();
    // When Enter is pressed, split the current line into two
    const updatedLines = [...scene.lines];
    const currentLine = updatedLines[lineIndex];

    const cursorPosition = event.target.selectionStart;
    // Split the line at the cursor position
    const firstPart = currentLine.slice(0, cursorPosition);
    const secondPart = currentLine.slice(cursorPosition);

    // Update the lines
    updatedLines[lineIndex] = firstPart;
    updatedLines.splice(lineIndex + 1, 0, secondPart);

    updateSceneLines(sceneIndex, updatedLines);
    
    // Focus on the next line
    setTimeout(() => {
      const nextInput =
        inputRefs.current[`scene-${sceneIndex}-line-${lineIndex + 1}`];
      nextInput && nextInput.focus();
    }, 0);
  } else if (event.key === "Tab") {
    // Prevent default Tab behavior
    event.preventDefault();
    const input = event.target;
    input.style.textAlign = "center"; // Center the text in the input box
  } else if (event.key === "Backspace" && scene.lines[lineIndex] === "") {
    // Handle Backspace behavior
    event.preventDefault();
    if (lineIndex > 0) {
      const updatedLines = [...scene.lines];
      updatedLines.splice(lineIndex, 1);
      updateSceneLines(sceneIndex, updatedLines);

      setTimeout(() => {
        const prevInput =
          inputRefs.current[`scene-${sceneIndex}-line-${lineIndex - 1}`];
        prevInput && prevInput.focus();
      }, 0);
    }
  } else if (event.key === "ArrowUp") {
    // Move to the upper input box
    event.preventDefault();
    if (lineIndex > 0) {
      const upperInput =
        inputRefs.current[`scene-${sceneIndex}-line-${lineIndex - 1}`];
      upperInput && upperInput.focus();
    } else if (sceneIndex > 0) {
      const prevScene = scenes[sceneIndex - 1];
      const lastLineIndex = prevScene.lines.length - 1;
      const lastInput =
        inputRefs.current[`scene-${sceneIndex - 1}-line-${lastLineIndex}`];
      lastInput && lastInput.focus();
    }
  } else if (event.key === "ArrowDown") {
    // Move to the lower input box
    event.preventDefault();
    if (lineIndex < scene.lines.length - 1) {
      const lowerInput =
        inputRefs.current[`scene-${sceneIndex}-line-${lineIndex + 1}`];
      lowerInput && lowerInput.focus();
    } else if (sceneIndex < scenes.length - 1) {
      const nextInput =
        inputRefs.current[`scene-${sceneIndex + 1}-line-0`];
      nextInput && nextInput.focus();
    }
  }
};

const handleChange = (event, sceneIndex, lineIndex) => {
  const value = event.target.value;
  const input = event.target;
  const scene = scenes[sceneIndex];
  const updatedLines = [...scene.lines];
  updatedLines[lineIndex] = value;

  updateSceneLines(sceneIndex, updatedLines);

  // Measure text width
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const computedStyle = window.getComputedStyle(input);
  const font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
  context.font = font;
  const textWidth = context.measureText(value).width;

  // If the text width exceeds the input width, create a new line
  if (textWidth > input.offsetWidth) {
    addNewLine(sceneIndex, lineIndex);
  }
};

const addNewLine = (sceneIndex, lineIndex) => {
  const scene = scenes[sceneIndex];
  const updatedLines = [...scene.lines];
  updatedLines.splice(lineIndex + 1, 0, "");
  updateSceneLines(sceneIndex, updatedLines);

  setTimeout(() => {
    const nextInput =
      inputRefs.current[`scene-${sceneIndex}-line-${lineIndex + 1}`];
    nextInput && nextInput.focus();
  }, 0);
};

const updateSceneLines = (sceneIndex, updatedLines) => {
  const updatedScenes = [...scenes];
  updatedScenes[sceneIndex] = {
    ...updatedScenes[sceneIndex],
    lines: updatedLines,
  };
  setScenes(updatedScenes);
};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center ">
      <div className="w-full h-10 bg-slate-200"></div>
      <div className="w-full flex justify-between mb-4 px-6">
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-pink-500"
          onClick={addNewScene}
        >
          Add Scene
        </button>
      </div>
<div className="w-full flex justify-center flex-col items-center space-y-8">
      {scenes.map((scene, sceneIndex) => (
        <div key={scene.id} className="w-11/12  bg-white rounded-lg lg:w-2/3">
          <div className="w-full bg-pink-100 p-4 mb-6 rounded-md shadow-md">
            <div className="flex items-center gap-2 justify-between mb-3">
              <span className="text-2xl bg-gray-200 py-1 px-3 rounded-md">
                {scene.id}
              </span>
              <input
                type="text"
                className="w-full bg-transparent text-3xl font-semibold outline-none"
                defaultValue={scene.title}
              />
              <span>
                <FaBars />
              </span>
            </div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl font-medium">Characters:</span>
              <button className=" inline-flex items-center text-xl font-bold justify-center text-white px-1.5 border border-black bg-gray-400 rounded shadow hover:bg-pink-500 hover:text-white">
                +
              </button>
            </div>
          </div>
          {/* Scene content */}
          <div>
            {scene.lines.map((line, lineIndex) => (
              <input
                key={lineIndex}
                id={`scene-${sceneIndex}-line-${lineIndex}`}
                ref={(el) =>
                  (inputRefs.current[`scene-${sceneIndex}-line-${lineIndex}`] =
                    el)
                }
                type="text"
                value={line}
                onChange={(e) => handleChange(e, sceneIndex, lineIndex)}
                onKeyDown={(e) => handleKeyDown(e, sceneIndex, lineIndex)}
                className=" w-[98%] text-xl bg-transparent outline-none  pb-2 pl-2"
              />
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Editor;
