import React, { useState } from 'react';

const DtoGenerator = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [generatedDto, setGeneratedDto] = useState('');
  const [language, setLanguage] = useState('java'); // Default to Java

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      const jsonObject = JSON.parse(jsonInput);
      const dtoClass = generateDtoClass(jsonObject);
      setGeneratedDto(dtoClass);
    } catch (error) {
      setGeneratedDto('Invalid JSON');
    }
  };

  const generateDtoClass = (jsonObject) => {
    const dtoName = 'GeneratedDto'; // You can modify this to get from input if needed
    let classString = '';

    if (language === 'java') {
      classString += `public class ${dtoName} {\n`;
      for (const [key, value] of Object.entries(jsonObject)) {
        const type = getJavaType(value);
        classString += `    private ${type} ${key};\n`;
      }
      classString += '\n    // Getters and Setters\n';
      classString += '}';
    } else {
      // For Kotlin
      classString += `data class ${dtoName} (\n`;
      for (const [key, value] of Object.entries(jsonObject)) {
        const type = getKotlinType(value);
        classString += `    val ${key}: ${type},\n`;
      }
      classString = classString.slice(0, -2) + '\n)'; // Remove last comma and add closing parenthesis
    }

    return classString;
  };

  const getJavaType = (value) => {
    if (Array.isArray(value)) {
      return 'List<Object>'; // You may want to handle arrays of specific types
    }
    switch (typeof value) {
      case 'string':
        return 'String';
      case 'number':
        return 'int'; // Use 'double' or 'float' for decimal values
      case 'boolean':
        return 'boolean';
      case 'object':
        return 'Object'; // Handle nested objects if needed
      default:
        return 'Object';
    }
  };

  const getKotlinType = (value) => {
    if (Array.isArray(value)) {
      return 'List<Any>'; // You may want to handle arrays of specific types
    }
    switch (typeof value) {
      case 'string':
        return 'String';
      case 'number':
        return 'Int'; // Use 'Double' for decimal values
      case 'boolean':
        return 'Boolean';
      case 'object':
        return 'Any'; // Handle nested objects if needed
      default:
        return 'Any';
    }
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
