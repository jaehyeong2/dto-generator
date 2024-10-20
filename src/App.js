import React, { useState } from 'react';

const DtoGenerator = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [generatedDto, setGeneratedDto] = useState('');
  const [language, setLanguage] = useState('java'); // Default to Java

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      const jsonObject = JSON.parse(jsonInput);
      const dtoClass = generateDtoClass(jsonObject, 'GeneratedDto');
      setGeneratedDto(dtoClass);
    } catch (error) {
      setGeneratedDto('Invalid JSON');
    }
  };

  const generateDtoClass = (jsonObject, className) => {
    let classString = '';
    if (language === 'java') {
      classString += `public class ${className} {\n`;
    } else {
      classString += `data class ${className} (\n`;
    }

    let innerClasses = '';

    for (const [key, value] of Object.entries(jsonObject)) {
      const fieldName = key;
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Nested object - create a new class
        const nestedClassName = capitalizeFirstLetter(fieldName);
        classString += `    private ${nestedClassName} ${fieldName};\n`;
        innerClasses += generateDtoClass(value, nestedClassName);
      } else if (Array.isArray(value)) {
        // Handling array
        if (typeof value[0] === 'object') {
          // Array of objects, generate class for array items
          const arrayClassName = capitalizeFirstLetter(fieldName.slice(0, -1)); // Singular form for class name
          classString += `    private List<${arrayClassName}> ${fieldName};\n`;
          innerClasses += generateDtoClass(value[0], arrayClassName); // Generate class for array items
        } else {
          const itemType = value.length > 0 ? getJavaType(value[0]) : 'Object';
          classString += `    private List<${itemType}> ${fieldName};\n`;
        }
      } else {
        // Simple field
        const type = language === 'java' ? getJavaType(value) : getKotlinType(value);
        classString += `    private ${type} ${fieldName};\n`;
      }
    }

    if (language === 'java') {
      classString += '\n    // Getters and Setters\n';
      classString += '}\n\n';
    } else {
      classString = classString.slice(0, -2) + '\n)\n\n'; // For Kotlin, remove last comma and add closing parenthesis
    }

    return classString + innerClasses;
  };

  const getJavaType = (value) => {
    if (Array.isArray(value)) {
      return 'List<Object>';
    }
    switch (typeof value) {
      case 'string':
        return 'String';
      case 'number':
        return 'double'; // Use 'double' for decimals
      case 'boolean':
        return 'boolean';
      case 'object':
        return 'Object';
      default:
        return 'Object';
    }
  };

  const getKotlinType = (value) => {
    if (Array.isArray(value)) {
      return 'List<Any>';
    }
    switch (typeof value) {
      case 'string':
        return 'String';
      case 'number':
        return 'Double'; // Kotlin uses capitalized types
      case 'boolean':
        return 'Boolean';
      case 'object':
        return 'Any';
      default:
        return 'Any';
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <h1>JSON to DTO Generator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          JSON Input:
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows="10"
            required
          />
        </label>

        <div>
          <label>
            <input
              type="radio"
              value="java"
              checked={language === 'java'}
              onChange={() => setLanguage('java')}
            />
            Java
          </label>
          <label>
            <input
              type="radio"
              value="kotlin"
              checked={language === 'kotlin'}
              onChange={() => setLanguage('kotlin')}
            />
            Kotlin
          </label>
        </div>

        <button type="submit">Generate DTO</button>
      </form>

      {generatedDto && (
        <div>
          <h2>Generated DTO:</h2>
          <pre>{generatedDto}</pre>
        </div>
      )}
    </div>
  );
};

export default DtoGenerator;
