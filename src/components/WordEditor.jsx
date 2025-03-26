import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import { MdOutlinePostAdd } from "react-icons/md";

const WordEditor = () => {
  const getStoredScenes = () => {
    const storedScenes = localStorage.getItem("scenes");
    if (storedScenes) {
      try {
        const parsedScenes = JSON.parse(storedScenes);
        return parsedScenes.map((scene, index) => ({
          ...scene,
          id: index + 1,
          content: Array.isArray(scene.content) ? scene.content : [],
          sceneType: scene.sceneType || "DAY/EXT", // Default to "DAY/EXT" if missing
        }));
      } catch (error) {
        console.error("Error parsing scenes from localStorage", error);
        return getDefaultScene();
      }
    } else {
      return getDefaultScene();
    }
  };
  
  const getDefaultScene = () => [
    {
      id: 1,
      title: "SOMEWHERE ",
      name: "Enter Your Film Name",
      characters: [],
      content: [
        {
          description: "",
        },
      ],
      isExpanded: true,
      sceneType: "DAY/EXT",
    },
  ];
  
  const [title, setTitle] = useState(() => {
    return localStorage.getItem("title") || "Enter Your Film Name";
  });
  
  const [scenes, setScenes] = useState(getStoredScenes);

  useEffect(() => {
    // Function to adjust a single textarea's height
    const adjustTextareaHeight = (textarea) => {
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    // Adjust all textareas in the component
    Object.values(inputRefs.current).forEach((element) => {
      if (element && element.tagName.toLowerCase() === 'textarea') {
        adjustTextareaHeight(element);
      }
    });
  }, [scenes]);
  useEffect(() => {
    // Update scene IDs before saving to ensure they're sequential
    const updatedScenes = scenes.map((scene, index) => ({
      ...scene,
      id: index + 1,
    }));
    localStorage.setItem("scenes", JSON.stringify(updatedScenes));
  }, [scenes]);

  const inputRefs = useRef({});
  const [selectedButton, setSelectedButton] = useState("Description");

//handle click button-------------------------------------------------------------------
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  
    const activeElement = document.activeElement;
  
    let activeSceneIndex = -1;
    Object.keys(inputRefs.current).forEach((key) => {
      if (inputRefs.current[key] === activeElement) {
        const match = key.match(/scene-(\d+)/);
        if (match) {
          activeSceneIndex = parseInt(match[1]);
        }
      }
    });
  
    setScenes((prevScenes) =>
      prevScenes.map((scene, index) => {
        if (index === activeSceneIndex) {
          let newContent = {};
          if (buttonName === "Dialog") {
            newContent = { dialog: "" };
          } else if (buttonName === "Characters") {
            newContent = { characters: "" };
          } else if (buttonName === "Description") {
            newContent = { description: "" };
          }
  
          return {
            ...scene,
            content: [...scene.content, newContent],
          };
        }
        return scene;
      })
    );
  };

  //onchange update contents-------------------------------------------------------------
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
                      [field]: value,
                    }
                  : content
              ),
            }
          : scene
      )
    );

    // Adjust height after content change
    setTimeout(() => {
      const textarea = inputRefs.current[`scene-${sceneIndex}-${field}-${contentIndex}`];
      if (textarea && textarea.tagName.toLowerCase() === 'textarea') {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, 0);
  };

//handle add new scene -----------------------------------------------------------------------------
  const handleAddScene = () => {
    setScenes((prevScenes) => {
      const newScene = {
        id: prevScenes.length + 1,
        title: `NEW SCENE `,
        characters: [],
        content: [
          {
            description: "",
          },
        ],
        isExpanded: true,
        sceneType: "DAY/EXT",
      };
      return [...prevScenes, newScene];
    });
  
    // Focus the description textarea of the new scene after it's added
    setTimeout(() => {
      const newSceneIndex = scenes.length;
      const newTextarea = inputRefs.current[`scene-${newSceneIndex}-description-0`];
      if (newTextarea) {
        newTextarea.focus();
      }
    }, 0);
  };
  
//handle delete scenes ------------------------------------------------------------------------
  const handleDeleteScene = (sceneIndex) => {
    setScenes((prevScenes) => {
      // Filter out the deleted scene and update IDs
      const updatedScenes = prevScenes
        .filter((_, index) => index !== sceneIndex)
        .map((scene, index) => ({
          ...scene,
          id: index + 1, // Reassign IDs to maintain sequence
        }));
      return updatedScenes;
    });
  };

  //handle press keyboard key words -------------------------------------------------
  const handleKeyDown = (event, sceneIndex, contentIndex) => {
    const input = event.target;
    if (event.key === "Backspace" && input.value === "") {
      event.preventDefault();
    
      // Don't delete if this is the only content in the scene
      const currentScene = scenes[sceneIndex];
      if (currentScene.content.length === 1) {
        return;
      }
    
      // Get references to all inputs in order
      const allInputRefs = Object.keys(inputRefs.current)
        .sort((a, b) => {
          const [sceneA, contentA] = a.split('-').slice(1);
          const [sceneB, contentB] = b.split('-').slice(1);
          return sceneA === sceneB ? contentA - contentB : sceneA - sceneB;
        });
    console.log(allInputRefs,'11111111111111111111111111')
      // Find current input index
      const currentInputKey = allInputRefs.find(
        (key) => inputRefs.current[key] === input
      );
      const currentIndex = allInputRefs.indexOf(currentInputKey);
    
      // Update selected button based on previous input type
      if (currentIndex > 0) {
        const prevInputKey = allInputRefs[currentIndex - 1];
        const type = prevInputKey.split('-')[2]; // Get input type from key
        setSelectedButton(type.charAt(0).toUpperCase() + type.slice(1));
      }
    
      // Update scenes state
      setScenes((prevScenes) => {
        const newScenes = prevScenes.map((scene, idx) => {
          if (idx === sceneIndex) {
            const newContent = scene.content.filter((_, i) => i !== contentIndex);
            return { ...scene, content: newContent };
          }
          return scene;
        });
        
        // Remove empty scenes
        return newScenes.filter(scene => scene.content.length > 0);
      });
    
      // Focus previous input
      setTimeout(() => {
        if (currentIndex > 0) {
          const prevInputKey = allInputRefs[currentIndex - 1];
          const prevInput = inputRefs.current[prevInputKey];
          
          if (prevInput) {
            prevInput.focus();
            if (prevInput.tagName.toLowerCase() === "textarea") {
              prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
            }
          }
        }
      }, 0);
      
      return;
    }
    if (event.key === "Tab" && event.shiftKey) {
      event.preventDefault();
  
      // Only create a new description if the selected button is Characters or Dialog
      if (selectedButton === "Characters" || selectedButton === "Dialog") {
        setSelectedButton("Description");
        setScenes((prevScenes) =>
          prevScenes.map((scene, index) => {
            if (index === sceneIndex) {
              const newContent = [...scene.content];
  
              // Insert a new characters object after the current dialog input
              if (selectedButton === "Characters" || selectedButton === "Dialog" && input.value.trim() !== "") {
                const insertIndex = contentIndex + 1;
                newContent.splice(insertIndex, 0, { description: "" });
  
                return { ...scene, content: newContent };
              }
            }
            return scene;
          })
        );
  
        // Focus the newly created description textarea
        setTimeout(() => {
          const descriptionInput = inputRefs.current[
            `scene-${sceneIndex}-description-${contentIndex + 1}`
          ];
          if (descriptionInput) descriptionInput.focus();
        }, 0);
      }
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      setSelectedButton("Characters");
      handleButtonClick("Characters");
      // Focus the newly created characters input
      setTimeout(() => {
        const charInput =
          inputRefs.current[
            `scene-${sceneIndex}-characters-${contentIndex + 1}`
          ];
        if (charInput) charInput.focus();
      }, 0);
    } else if (event.key === "Enter") {
      // Only prevent default and switch mode if shift+enter is not pressed
      if (!event.shiftKey && selectedButton !== "Description") {
        event.preventDefault();
        if (selectedButton === "Characters" && input.value.trim() !== "") {
          // Only proceed if there's a value in the characters input
          setScenes((prevScenes) =>
            prevScenes.map((scene, index) =>
              index === sceneIndex
                ? {
                    ...scene,
                    characters: scene.characters.includes(input.value.trim())
                      ? scene.characters
                      : [...scene.characters, input.value.trim()],
                  }
                : scene
            )
          );
          setScenes((prevScenes) =>
            prevScenes.map((scene, index) => {
              if (index === sceneIndex) {
                const newContent = [...scene.content];
    
                // Insert a new dialog object after the current character input
                if (selectedButton === "Characters" && input.value.trim() !== "") {
                  const insertIndex = contentIndex + 1;
                  newContent.splice(insertIndex, 0, { dialog: "" });
    
                  return { ...scene, content: newContent };
                }
              }
              return scene;
            })
          );
          setSelectedButton("Dialog");
          // Focus the dialog textarea
          setTimeout(() => {
            const dialogInput = inputRefs.current[`scene-${sceneIndex}-dialog-${contentIndex + 1}`];
            if (dialogInput) dialogInput.focus();
          }, 0);
        } else if (selectedButton === "Dialog" && input.value.trim() !== "") {
          setScenes((prevScenes) =>
            prevScenes.map((scene, index) => {
              if (index === sceneIndex) {
                const newContent = [...scene.content];
    
                // Insert a new characters object after the current dialog input
                if (selectedButton === "Dialog" && input.value.trim() !== "") {
                  const insertIndex = contentIndex + 1;
                  newContent.splice(insertIndex, 0, { characters: "" });
    
                  return { ...scene, content: newContent };
                }
              }
              return scene;
            })
          );
          setSelectedButton("Characters");
          // Focus the characters input
          setTimeout(() => {
            const charInput =
              inputRefs.current[
                `scene-${sceneIndex}-characters-${contentIndex + 1}`
              ];
            if (charInput) charInput.focus();
          }, 0);
        }
      }
    }
  };

  //Remove charecters Array list -----------------------------------------------------------
  const removeCharacter = (sceneIndex, charIndex) => {
    setScenes(scenes.map((scene, index) => 
      index === sceneIndex 
        ? { 
            ...scene, 
            characters: scene.characters.filter((_, i) => i !== charIndex)
          }
        : scene
    ));
  };

  const handleTitleChange = (id, newTitle) => {
    setScenes((prevScenes) => {
      const updatedScenes = prevScenes.map((scene) =>
        scene.id === id ? { ...scene, title: newTitle } : scene
      );
      
      // Store the updated scenes in localStorage
      localStorage.setItem("scenes", JSON.stringify(updatedScenes));
  
      return updatedScenes;
    });
  };

  const handleSceneTypeChange = (id, newSceneType) => {
    setScenes((prevScenes) => {
      const updatedScenes = prevScenes.map((scene) =>
        scene.id === id ? { ...scene, sceneType: newSceneType } : scene
      );
  
      localStorage.setItem("scenes", JSON.stringify(updatedScenes));
      return updatedScenes;
    });
  };
  

  useEffect(() => {
    localStorage.setItem("title", title);
  }, [title]);
  
  const handleTitleChangee = (e) => {
    setTitle(e.target.value);
  };

  console.log(scenes,'aaaaaaaaaaaaaaaaaaaaaaaaaaa')
  return (
    <div className="min-h-screen bg-gray-100">
    {/* Header - Responsive title input */}
    <div className="flex w-full justify-center p-4">
  <input 
    type="text" 
    className="text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-medium bg-transparent outline-none w-full md:w-2/3 text-center border-b-4 border-black border-opacity-30 mb-6 py-2" 
    value={title}
    onChange={handleTitleChangee}
  />
</div>;

    <div className="flex flex-col ">
      {/* Sidebar Controls - Responsive positioning */}
      <div className="w-full  flex justify-center sticky top-5  z-50 ">
        <div className="flex justify-center w-[85%] lg:w-4/5 xl:w-[52%] 2xl:w-[45%]  border border-opacity-30  py-7 px-9 gap-4 bg-gray-100 border-black rounded-xl">
          {/* Scene Action Button */}

          <div className="flex flex-col w-1/3 2xl:w-1/3 space-y-4 ">
            <button className={`border border-black border-opacity-30 rounded-full px-4 py-2 ${
            selectedButton === "Description" 
              ? "bg-pink-100 text-black font-semibold" 
              : "bg-blue-200 text-black font-medium"
          }`}>Action</button>
            <p  className="text-center text-opacity-70 text-black">Press Keyboard Shift+Tab</p>
          </div>
{/* Add Character Button */}
          <div className="flex flex-col w-1/3 2xl:w-1/3  space-y-4 ">
            <button className={`border border-black border-opacity-30 rounded-full px-4 py-2 ${
            selectedButton === "Characters" 
              ? "bg-pink-100 text-black font-semibold" 
              : "bg-blue-200 text-black font-medium"
          }`}>Character</button>
            <p className="text-center text-opacity-70 text-black">Press Keyboard Tab</p>
          </div>

                   {/* Add Dialog Button */}
          <div className="flex flex-col w-1/3 2xl:w-1/3  space-y-4 ">
            <button className={`border border-black border-opacity-30 rounded-full px-4 py-2 ${
            selectedButton === "Dialog" 
              ? "bg-pink-100 text-black font-semibold" 
              : "bg-blue-200 text-black font-medium"
          }`}>Dialog</button>
            <p className="text-center text-opacity-70 text-black">Type Character & Press Enter</p>
          </div>

 
      
        </div>
      </div>
<div className="w-full flex justify-center">
      {/* Main Content Area - Responsive width and padding */}
      <div className="w-full  lg:w-4/5  px-4 md:px-8 lg:px-6 mt-4 lg:mt-7 flex flex-col space-y-8">
      {scenes.map((scene, sceneIndex) => (
          <div key={scene.id} className="w-full bg-white rounded-lg">
            {/* Scene Header */}
            <div className="w-full bg-pink-100 p-3 md:p-4 mb-6 rounded-md shadow-md">
              <div className="flex items-center gap-2 justify-between mb-3">
                <span className="text-xl md:text-2xl bg-gray-200 py-1 px-3 rounded-md">
                {sceneIndex + 1}
                </span>
                <select
                  name="sceneType"
                  id="sceneType"
                  className="bg-transparent border-none text-xl md:text-xl lg:text-xl xl:text-xl mt-2 2xl:text-2xl font-medium outline-none focus:ring-0"
                  value={scene.sceneType} // Set the selected value
                  onChange={(e) => handleSceneTypeChange(scene.id, e.target.value)}
                >
                  <option value="DAY/EXT">DAY/EXT</option>
                  <option value="NIGHT/EXT">NIGHT/EXT</option>
                  <option value="DAY/INT">DAY/INT</option>
                  <option value="NIGHT/INT">NIGHT/INT</option>
                </select>

                <input
                  type="text"
                  className="w-full bg-transparent text-xl md:text-xl lg:text-2xl xl:text-3xl 2xl:text-3xl font-medium outline-none"
                  value={scene.title}
                  onChange={(e) => handleTitleChange(scene.id, e.target.value)}
                />
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-200 rounded-full">
                    {scene.isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {scenes.length > 1 && (
                <button
                  className="p-2 hover:bg-red-200 rounded-full text-red-500"
                  onClick={() => handleDeleteScene(sceneIndex)}
                >
                  <FaTrash />
                </button>
              )}
                </div>
              </div>

              {/* Characters Section */}
              <div className="mb-4 mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-xl md:text-xl font-medium">Characters:</span>
                {scene.characters.map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className="text-lg md:text-lg lg:text-lg font-medium text-white bg-gray-400 px-4 py-2 rounded-xl flex items-center gap-2"
                  >
                    {char}
                    <button onClick={() => removeCharacter(sceneIndex, charIndex)} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Scene Content */}
            {scene.content.map((content, contentIndex) => (
              <div key={contentIndex} className="mb-4">
                {/* Description */}
                {content.description !== undefined && (
                  <textarea
                    ref={(el) => (inputRefs.current[`scene-${sceneIndex}-description-${contentIndex}`] = el)}
                    className="w-full p-3 md:p-4 text-xl md:text-2xl outline-none resize-none"
                    value={content.description}
                    placeholder="Type Your Content Here...................."
                    onChange={(e) => handleContentChange(sceneIndex, contentIndex, "description", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, sceneIndex, contentIndex)}
                    onFocus={() => setSelectedButton("Description")}
                  />
                )}

                {/* Characters Input */}
                {content.characters !== undefined && (
                  <div className="w-full flex justify-center">
                    <input
                      ref={(el) => (inputRefs.current[`scene-${sceneIndex}-characters-${contentIndex}`] = el)}
                      type="text"
                      className="w-full md:w-1/2 text-xl md:text-3xl text-center p-2 outline-none"
                      placeholder="Type your characters..."
                      value={content.characters}
                      onChange={(e) => handleContentChange(sceneIndex, contentIndex, "characters", e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, sceneIndex, contentIndex)}
                      onFocus={() => setSelectedButton("Characters")}
                    />
                  </div>
                )}

                {/* Dialog */}
                {content.dialog !== undefined && (
                  <div className="w-full flex justify-center">
                    <textarea
                      ref={(el) => (inputRefs.current[`scene-${sceneIndex}-dialog-${contentIndex}`] = el)}
                      className="w-full md:w-3/5 text-xl md:text-2xl p-2 outline-none resize-none"
                      rows={2}
                      placeholder="Type your dialog..."
                      value={content.dialog}
                      onChange={(e) => handleContentChange(sceneIndex, contentIndex, "dialog", e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, sceneIndex, contentIndex)}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      onFocus={() => setSelectedButton("Dialog")}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Add Scene Button */}
        <div className="mt-4 flex justify-center pb-8">
          <button
            className="border flex  justify-center items-center gap-1  text-lg md:text-lg font-bold border-black border-opacity-30 hover:bg-gray-300 rounded-lg px-4 py-1 bg-white text-black"
            onClick={handleAddScene}
          >
            <span><MdOutlinePostAdd size={23}/></span>
            <span className="font-semibold mt-[6px] text-lg">New Scene</span>
          </button>
        </div>
      </div>
</div>


    </div>
  </div>
  );
};

export default WordEditor;
