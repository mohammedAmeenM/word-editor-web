import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";

const Editor = () => {
  const [scenes, setScenes] = useState([
    {
      id: 1,
      title: " SOMEWHERE - DAY",
      lines: ["Click here to type your scene content..."],
      characters: [],
      isExpanded: true,
    },
  ]);
  const inputRefs = useRef({});
  const [selectedButton, setSelectedButton] = useState("Description");

  // Auto-select Description button and focus on first line when component mounts
  useEffect(() => {
    const firstInput = inputRefs.current[`scene-0-line-0`];
    if (firstInput) {
      firstInput.focus();
      firstInput.style.textAlign = "left";
      firstInput.style.paddingLeft = "2%";
    }
  }, []);

  const addNewScene = () => {
    setSelectedButton("Description");
    const newScene = {
      id: scenes.length + 1,
      title: "EXT. NEW SCENE - DAY",
      lines: ["Click here to type your scene content..."],
      characters: [],
      isExpanded: true,
    };
    setScenes([...scenes, newScene]);
  };

  const deleteScene = (sceneIndex) => {
    if (scenes.length > 1) {
      const updatedScenes = scenes.filter((_, index) => index !== sceneIndex);
      const reorderedScenes = updatedScenes.map((scene, index) => ({
        ...scene,
        id: index + 1,
      }));
      setScenes(reorderedScenes);
    }
  };

  const toggleSceneExpansion = (sceneIndex) => {
    setScenes(
      scenes.map((scene, index) =>
        index === sceneIndex
          ? { ...scene, isExpanded: !scene.isExpanded }
          : scene
      )
    );
  };

  const addCharacter = (sceneIndex, text) => {
    if (text.trim()) {
      setScenes((prevScenes) =>
        prevScenes.map((scene, index) =>
          index === sceneIndex
            ? { ...scene, characters: [...scene.characters, text.trim()] }
            : scene
        )
      );
    }
  };

  const removeCharacter = (sceneIndex, charIndex) => {
    setScenes(
      scenes.map((scene, index) =>
        index === sceneIndex
          ? {
              ...scene,
              characters: scene.characters.filter((_, i) => i !== charIndex),
            }
          : scene
      )
    );
  };

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);

    const firstSceneIndex = 0;
    const lastLineIndex = scenes[firstSceneIndex].lines.length - 1;
    const lastInput =
      inputRefs.current[`scene-${firstSceneIndex}-line-${lastLineIndex}`];

    if (lastInput) {
      switch (buttonName) {
        case "Description":
          lastInput.style.textAlign = "left";
          lastInput.style.paddingLeft = "2%";
          break;
        case "Characters":
          lastInput.style.textAlign = "center";
          lastInput.style.paddingLeft = "0%";
          break;
        case "Dailog":
          lastInput.style.textAlign = "left";
          lastInput.style.paddingLeft = "25%";
          break;
      }
      lastInput.focus();
    }
  };

  const handleKeyDown = (event, sceneIndex, lineIndex) => {
    const scene = scenes[sceneIndex];
    const input = event.target;

    if (event.key === "Enter") {
      event.preventDefault();

      if (selectedButton === "Characters" && input.value.trim()) {
        addCharacter(sceneIndex, input.value);
        input.value = "";

        setSelectedButton("Dailog");

        setScenes((prevScenes) => {
          const updatedScenes = [...prevScenes];
          const updatedLines = [...updatedScenes[sceneIndex].lines];
          updatedLines.splice(lineIndex + 1, 0, "");
          updatedScenes[sceneIndex] = {
            ...updatedScenes[sceneIndex],
            lines: updatedLines,
          };
          return updatedScenes;
        });

        setTimeout(() => {
          const nextInput =
            inputRefs.current[`scene-${sceneIndex}-line-${lineIndex + 1}`];
          if (nextInput) {
            nextInput.focus();
            nextInput.style.textAlign = "left";
            nextInput.style.paddingLeft = "25%";
          }
        }, 0);
        return;
      }
      if (selectedButton === "Dailog" && input.value.trim()) {
        setSelectedButton("Characters");

        // Create new line and set dialog formatting
        const updatedLines = [...scene.lines];
        updatedLines.splice(lineIndex + 1, 0, "");
        updateSceneLines(sceneIndex, updatedLines);

        setTimeout(() => {
          const nextInput =
            inputRefs.current[`scene-${sceneIndex}-line-${lineIndex + 1}`];
          if (nextInput) {
            nextInput.focus();
            nextInput.style.textAlign = "center";
            nextInput.style.paddingLeft = "0%";
          }
        }, 0);
        return;
      }
      // Normal Enter behavior
      const updatedLines = [...scene.lines];
      const currentLine = updatedLines[lineIndex];
      const cursorPosition = input.selectionStart;
      const firstPart = currentLine.slice(0, cursorPosition);
      const secondPart = currentLine.slice(cursorPosition);

      updatedLines[lineIndex] = firstPart;
      updatedLines.splice(lineIndex + 1, 0, secondPart);
      updateSceneLines(sceneIndex, updatedLines);

      setTimeout(() => {
        const nextInput =
          inputRefs.current[`scene-${sceneIndex}-line-${lineIndex + 1}`];
        if (nextInput) {
          nextInput.focus();
          nextInput.style.textAlign = input.style.textAlign;
          nextInput.style.paddingLeft = input.style.paddingLeft;
        }
      }, 0);
    } else if (event.key === "Tab") {
      event.preventDefault();
      if (selectedButton === "Description") {
        setSelectedButton("Characters");
        input.style.textAlign = "center";
        input.style.paddingLeft = "0%";
      }
    } else if (event.key === "Backspace" && scene.lines[lineIndex] === "") {
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
      event.preventDefault();
      if (lineIndex < scene.lines.length - 1) {
        const lowerInput =
          inputRefs.current[`scene-${sceneIndex}-line-${lineIndex + 1}`];
        lowerInput && lowerInput.focus();
      } else if (sceneIndex < scenes.length - 1) {
        const nextInput = inputRefs.current[`scene-${sceneIndex + 1}-line-0`];
        nextInput && nextInput.focus();
      }
    }
  };

  const handleChange = (event, sceneIndex, lineIndex) => {
    const value = event.target.value;
    const input = event.target;
    const scene = scenes[sceneIndex];
    const updatedLines = [...scene.lines];
    // Measure text width
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const computedStyle = window.getComputedStyle(input);
    const font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
    context.font = font;
    const textWidth = context.measureText(value).width;
    // If the text width exceeds the input width
    if (textWidth > input.offsetWidth) {
      const lastSpaceIndex = value.lastIndexOf(" ");

      if (lastSpaceIndex !== -1) {
        // Split at the last space
        const currentLine = value.substring(0, lastSpaceIndex);
        const newLine = value.substring(lastSpaceIndex + 1);

        updatedLines[lineIndex] = currentLine;
        updatedLines.splice(lineIndex + 1, 0, newLine);
      } else {
        // If no space found, just move the overflow text to a new line
        updatedLines[lineIndex] = value;
        updatedLines.splice(lineIndex + 1, 0, "");
      }

      updateSceneLines(sceneIndex, updatedLines);

      setTimeout(() => {
        const nextInput =
          inputRefs.current[`scene-${sceneIndex}-line-${lineIndex + 1}`];
        nextInput && nextInput.focus();
      }, 0);
    } else {
      // Update the line normally if it fits
      updatedLines[lineIndex] = value;
      updateSceneLines(sceneIndex, updatedLines);
    }
  };

  // const addNewLine = (sceneIndex, lineIndex) => {
  //   const scene = scenes[sceneIndex];
  //   const updatedLines = [...scene.lines];
  //   updatedLines.splice(lineIndex + 1, 0, "");
  //   updateSceneLines(sceneIndex, updatedLines);

  //   setTimeout(() => {
  //     const nextInput =
  //       inputRefs.current[`scene-${sceneIndex}-line-${lineIndex + 1}`];
  //     nextInput && nextInput.focus();
  //   }, 0);
  // };

  // const updateSceneLines = (sceneIndex, updatedLines) => {
  //   const updatedScenes = [...scenes];
  //   updatedScenes[sceneIndex] = {
  //     ...updatedScenes[sceneIndex],
  //     lines: updatedLines,
  //   };
  //   setScenes(updatedScenes);
  // };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center ">
      {/* buttoonssss */}
      <div className="w-full flex justify-center pt-5 gap-3 mb-4 px-6">
        <button
          className={`border border-black rounded-lg px-4 py-2 ${
            selectedButton === "Add Scene"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => {
            addNewScene();
          }}
        >
          Add Scene
        </button>
        <button
          className={`border border-black rounded-lg px-4 py-2 ${
            selectedButton === "Description"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleButtonClick("Description")}
        >
          Description
        </button>
        <button
          className={`border border-black rounded-lg px-4 py-2 ${
            selectedButton === "Characters"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleButtonClick("Characters")}
        >
          Characters
        </button>
        <button
          className={`border border-black rounded-lg px-4 py-2 ${
            selectedButton === "Dailog"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleButtonClick("Dailog")}
        >
          Dailogs
        </button>
        <button
          className={`border border-black rounded-lg px-4 py-2 ${
            selectedButton === "Code"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleButtonClick("Code")}
        >
          Code
        </button>
      </div>

      <div className="w-full flex justify-center flex-col items-center space-y-8">
        {scenes.map((scene, sceneIndex) => (
          <div key={scene.id} className="w-11/12 bg-white rounded-lg lg:w-2/3">
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
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSceneExpansion(sceneIndex)}
                    className="p-2 hover:bg-gray-200 rounded-full"
                  >
                    {scene.isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {scenes.length > 1 && (
                    <button
                      onClick={() => deleteScene(sceneIndex)}
                      className="p-2 hover:bg-red-200 rounded-full text-red-500"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>

              {/* Characters section */}
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                <span className="text-xl font-medium">Characters:</span>
                {scene.characters.map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className="text-xl font-bold text-white bg-gray-400 px-2 py-1 rounded-full flex items-center gap-2"
                  >
                    {char}
                    <button
                      onClick={() => removeCharacter(sceneIndex, charIndex)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => addCharacter(sceneIndex)}
                  className="inline-flex items-center text-xl font-bold justify-center text-white px-1.5 border border-black bg-gray-400 rounded shadow hover:bg-pink-500 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Scene content */}
            {scene.isExpanded && (
              <div className="w-full">
                {scene.lines.map((line, lineIndex) => (
                  <input
                    key={lineIndex}
                    id={`scene-${sceneIndex}-line-${lineIndex}`}
                    ref={(el) =>
                      (inputRefs.current[
                        `scene-${sceneIndex}-line-${lineIndex}`
                      ] = el)
                    }
                    type="text"
                    value={line}
                    onChange={(e) => handleChange(e, sceneIndex, lineIndex)}
                    onKeyDown={(e) => handleKeyDown(e, sceneIndex, lineIndex)}
                    className="w-[97%] text-xl bg-transparent outline-none pb-2 pl-2"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Editor;
