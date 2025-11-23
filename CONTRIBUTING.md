# Contributing to CSAE Toolkit 🤝

First off, thank you for considering contributing to CSAE Toolkit! It's people like you that make this tool better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript Style Guide](#javascript-style-guide)
  - [React Best Practices](#react-best-practices)
- [Project Structure](#project-structure)
- [Testing](#testing)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 10, macOS 12.0]
 - Chrome Version: [e.g. 120.0.6099.109]
 - Extension Version: [e.g. 1.2.6]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title** - Use a clear and descriptive title
- **Detailed description** - Provide a step-by-step description of the suggested enhancement
- **Use cases** - Explain why this enhancement would be useful
- **Mockups** - If applicable, include mockups or examples

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Ensure the linter passes** by running `npm run lint`
6. **Write clear commit messages** following our commit guidelines
7. **Submit a pull request** with a comprehensive description

**Pull Request Template:**

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran to verify your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested the changes in Chrome
```

## Development Setup

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/csae-toolkit.git
   cd csae-toolkit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Load extension in Chrome**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

5. **Make your changes**
   - Edit files in the `src/` directory
   - The extension will rebuild automatically

## Style Guidelines

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

**Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect the meaning of the code
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding missing tests
- `chore`: Changes to the build process or auxiliary tools

**Example:**
```
feat: add keyboard shortcuts for CSS selector tool

Implemented Ctrl+Shift+S to activate the CSS selector grabber.
This allows power users to quickly access the tool without clicking.

Closes #123
```

### JavaScript Style Guide

- Use **ES6+ features** where appropriate
- Follow **ESLint** rules configured in `.eslintrc.cjs`
- Use **meaningful variable names**
- Add **comments** for complex logic
- Keep functions **small and focused**
- Use **destructuring** when appropriate
- Prefer **arrow functions** for callbacks

**Example:**
```javascript
// Good
const handleColorPicker = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js'],
    });
  });
};

// Avoid
function handleColorPicker() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(tabs.length > 0) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        files: ['content.js']
      });
    }
  });
}
```

### React Best Practices

- Use **functional components** with hooks
- Keep components **small and reusable**
- Use **meaningful prop names**
- Implement **proper prop validation** when needed
- Use **useEffect** cleanup functions when necessary
- Follow **React Hooks rules**

**Example:**
```javascript
// Good
const StorageManager = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await chrome.storage.local.get();
      setData(result);
    };

    loadData();
  }, []);

  return <div>{/* ... */}</div>;
};
```

## Project Structure

Understanding the project structure helps you know where to make changes:

```
src/
├── App.jsx              # Main application component
├── UserGuide.jsx        # User guide UI component
├── StorageManager.jsx   # Storage management component
├── DateTime.jsx         # Date/time display component
├── main.jsx            # Application entry point
├── devtools.js         # DevTools integration logic
├── panel.js            # Panel-specific logic
└── assets/             # Static assets (images, icons)
```

## Testing

Before submitting a PR:

1. **Manual Testing**
   - Test all affected features in Chrome
   - Verify the extension loads without errors
   - Check that existing functionality still works
   - Test on different screen sizes if UI changes were made

2. **Linting**
   ```bash
   npm run lint
   ```

3. **Build Test**
   ```bash
   npm run build
   ```
   Ensure the build completes without errors

## Questions?

Don't hesitate to ask questions by:
- Opening an issue with the `question` label
- Reaching out to the maintainers

## Recognition

Contributors will be recognized in the project. Thank you for your contributions!

---

**Happy Contributing!** 🎉
