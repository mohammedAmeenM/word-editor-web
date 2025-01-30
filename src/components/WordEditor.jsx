import React, { useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";

const WordEditor = () => {
  const [scenes, setScenes] = useState([
    {
      id: 1,
      title: "EXT. SOMEWHERE - DAY",
      characters: [],
      content: [
        {
          description: "", // Initially, only the description exists
        },
      ],
      isExpanded: true,
    },
  ]);

  const inputRefs = useRef({});
  const [selectedButton, setSelectedButton] = useState("Description");

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);

    setScenes((prevScenes) =>
      prevScenes.map((scene) => {
        let newContent = {};

        if (buttonName === "Dialog") {
          newContent = { dialog: "" }; // Create a new object with only the dialog key
        } else if (buttonName === "Characters") {
          newContent = { characters: "" }; // Create a new object with only the characters key
        } else if (buttonName === "Description") {
          newContent = { description: "" }; // Create a new object with only the description key
        }

        return {
          ...scene,
          content: [...scene.content, newContent], // Append the new object to the content array
        };
      })
    );
  };

  const handleContentChange = (sceneIndex, contentIndex, field, value) => {
    setScenes((prevScenes) =>
      prevScenes.map((scene, index) =>
        index === sceneIndex
          ? {
              ...scene,
              content: scene.content.map((content, idx) =>
                idx === contentIndex
                  ? {
                      ...content,
                      [field]: value, // Update the specific field
                    }
                  : content
              ),
            }
          : scene
      )
    );
  };

  console.log(scenes, "Scenes State");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Buttons */}
      <div className="w-full flex justify-center pt-5 gap-3 mb-4 px-6">
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
            selectedButton === "Dialog"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleButtonClick("Dialog")}
        >
          Dialog
        </button>
      </div>

      {/* Scenes */}
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
                  <button className="p-2 hover:bg-gray-200 rounded-full">
                    {scene.isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {scenes.length > 1 && (
                    <button className="p-2 hover:bg-red-200 rounded-full text-red-500">
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>

              {/* Characters Section */}
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                <span className="text-xl font-medium">Characters:</span>
                {scene.characters.map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className="text-xl font-bold text-white bg-gray-400 px-2 py-1 rounded-full flex items-center gap-2"
                  >
                    {char}
                    <button className="hover:text-red-500">×</button>
                  </span>
                ))}
                <button className="inline-flex items-center text-xl font-bold justify-center text-white px-1.5 border border-black bg-gray-400 rounded shadow hover:bg-pink-500 hover:text-white">
                  +
                </button>
              </div>
            </div>

            {/* Scene Content - Show only selected content */}
            {scene.content.map((content, contentIndex) => (
              <div key={contentIndex}>
                {/* Render Description Textarea */}
                {content.description !== undefined && (
                  <textarea
                    ref={(el) =>
                      (inputRefs.current[
                        `scene-${sceneIndex}-description-${contentIndex}`
                      ] = el)
                    }
                    className="w-full p-2 outline-none resize-none"
                    rows={2}
                    placeholder="Type your description..."
                    value={content.description}
                    onChange={(e) =>
                      handleContentChange(
                        sceneIndex,
                        contentIndex,
                        "description",
                        e.target.value
                      )
                    }
                    onInput={(e) => {
                      e.target.style.height = "auto"; // Reset height
                      e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on content
                    }}
                  />
                )}

                {/* Render Characters Input */}
                {content.characters !== undefined && (
                    <div className="w-full flex justify-center">
                  <input
                    ref={(el) =>
                      (inputRefs.current[
                        `scene-${sceneIndex}-characters-${contentIndex}`
                      ] = el)
                    }
                    type="text"
                    className="w-1/2  text-center p-2 outline-none"
                    placeholder="Type your characters..."
                    value={content.characters}
                    onChange={(e) =>
                      handleContentChange(
                        sceneIndex,
                        contentIndex,
                        "characters",
                        e.target.value
                      )
                    }
                  />
                  </div>
                )}

                {/* Render Dialog Textarea */}
                {content.dialog !== undefined && (
                    <div className="w-full flex justify-center">
                  <textarea
                    ref={(el) =>
                      (inputRefs.current[
                        `scene-${sceneIndex}-dialog-${contentIndex}`
                      ] = el)
                    }
                    className="w-3/5  overflow-hidden p-2 outline-none resize-none"
                    rows={2}
                    placeholder="Type your dialog..."
                    value={content.dialog}
                    onChange={(e) =>
                      handleContentChange(
                        sceneIndex,
                        contentIndex,
                        "dialog",
                        e.target.value
                      )
                    }
                    onInput={(e) => {
                      e.target.style.height = "auto"; // Reset height
                      e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on content
                    }}
                  />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordEditor;