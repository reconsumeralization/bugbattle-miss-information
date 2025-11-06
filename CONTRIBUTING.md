# Contributing to BugBattle

Thank you for your interest in contributing to BugBattle (Miss Information Platform)! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Security Contributions](#security-contributions)
- [Community](#community)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background or experience level.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or inflammatory remarks
- Personal attacks or insults
- Publishing others' private information
- Any conduct that creates an intimidating environment

### Enforcement

Violations can be reported to conduct@yourdomain.com. All complaints will be reviewed and investigated promptly and fairly.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git
- A GitHub account

### Initial Setup

1. **Fork the repository** on GitHub

2. **Clone your fork:**
```bash
git clone https://github.com/YOUR_USERNAME/bugbattle-miss-information.git
cd bugbattle-miss-information
```

3. **Add upstream remote:**
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/bugbattle-miss-information.git
```

4. **Install dependencies:**
```bash
npm install
```

5. **Set up environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

6. **Run the development server:**
```bash
npm run dev
```

7. **Verify everything works** by opening http://localhost:3000

## Development Workflow

### Keeping Your Fork Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Merge upstream changes into your main branch
git checkout main
git merge upstream/main

# Push updates to your fork
git push origin main
```

### Creating a Feature Branch

```bash
# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/component-name` - Code refactoring
- `test/test-description` - Adding or updating tests
- `chore/task-description` - Maintenance tasks

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

#### 1. Code Contributions
- New features
- Bug fixes
- Performance improvements
- Refactoring

#### 2. Documentation
- README improvements
- API documentation
- Code comments
- Tutorial creation
- Translation

#### 3. Testing
- Writing tests
- Improving test coverage
- Testing bug fixes
- Performance testing

#### 4. Design
- UI/UX improvements
- Accessibility enhancements
- Visual assets
- Style guide development

#### 5. Issue Management
- Bug reports
- Feature requests
- Issue triage
- Helping others with issues

### Finding Something to Work On

1. **Check open issues** labeled:
   - `good first issue` - Perfect for newcomers
   - `help wanted` - We need assistance
   - `bug` - Known bugs to fix
   - `enhancement` - Feature requests

2. **Create a new issue** if you've found a bug or have a feature idea

3. **Comment on an issue** you'd like to work on to avoid duplication

## Coding Standards

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### JavaScript/TypeScript Guidelines

**General Principles:**
- Write clear, self-documenting code
- Prefer readability over cleverness
- Keep functions small and focused
- Use meaningful variable names
- Comment complex logic

**Naming Conventions:**
```javascript
// Components: PascalCase
const MissInformationGame = () => {};

// Functions/variables: camelCase
const fetchGameData = () => {};
const userScore = 0;

// Constants: UPPER_SNAKE_CASE
const MAX_ATTEMPTS = 3;

// Private functions: _leadingUnderscore
const _internalHelper = () => {};

// File names: kebab-case
// miss-information-game.tsx
// api-security.md
```

**React/Next.js Specific:**
```javascript
// Use functional components with hooks
const MyComponent = () => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return <div>Content</div>;
};

// Prop types (TypeScript preferred)
interface MyComponentProps {
  title: string;
  count?: number;
}

// Default exports for pages, named for components
export default MyComponent;
```

### File Organization

```
component-folder/
├── ComponentName.tsx          # Main component
├── ComponentName.module.css   # Styles (if needed)
├── ComponentName.test.tsx     # Tests
├── index.ts                   # Barrel export
└── types.ts                   # TypeScript types
```

### API Route Guidelines

```javascript
// pages/api/example/route.ts
export default async function handler(req, res) {
  // 1. Validate authentication
  if (!req.session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Check HTTP method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 3. Validate input
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: 'Missing data' });
  }

  // 4. Process request
  try {
    const result = await processData(data);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:rss
npm run test:wikipedia
npm run test:verification

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

### Writing Tests

**Test Structure:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

**API Tests:**
```javascript
import { createMocks } from 'node-mocks-http';
import handler from './api-route';

describe('/api/example', () => {
  it('should return 200 for valid request', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { data: 'test' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({ success: true })
    );
  });
});
```

### Test Coverage

Aim for:
- Unit tests: 80%+ coverage
- Critical paths: 100% coverage
- API endpoints: Full coverage
- UI components: Essential interactions

## Pull Request Process

### Before Submitting

**Checklist:**
- [ ] Code follows our style guidelines
- [ ] Tests pass locally (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated (if needed)
- [ ] Commits are clean and well-described
- [ ] Branch is up-to-date with main

### Creating a Pull Request

1. **Push your branch:**
```bash
git push origin feature/your-feature-name
```

2. **Open a PR** on GitHub with:
   - Clear title describing the change
   - Detailed description of what and why
   - Link to related issues (Fixes #123)
   - Screenshots for UI changes
   - Breaking changes clearly noted

3. **PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Testing
How to test these changes

## Screenshots
(if applicable)

## Checklist
- [ ] Tests pass
- [ ] Linter passes
- [ ] Documentation updated
- [ ] Breaking changes documented
```

### Review Process

1. **Automated checks** must pass:
   - CI/CD pipeline
   - Code quality checks
   - Security scans

2. **Code review** by maintainers:
   - At least one approval required
   - Address all feedback
   - Keep discussion professional

3. **Merge:**
   - We'll merge your PR when approved
   - May squash commits for clean history

### After Merge

- Your contribution will be in the next release
- You'll be added to contributors list
- Thank you for your contribution!

## Security Contributions

### Reporting Vulnerabilities

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email security@yourdomain.com
2. Provide detailed information
3. Allow 90 days for coordinated disclosure
4. See [SECURITY.md](SECURITY.md) for full policy

### Security-Related PRs

For non-sensitive security improvements:
- Label PR with `security`
- Explain the security benefit
- Include tests demonstrating fix

## Community

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas, general discussion
- **Email**: contact@yourdomain.com

### Getting Help

- Check existing documentation
- Search closed issues
- Ask in GitHub Discussions
- Reach out to maintainers

### Recognition

Contributors are recognized through:
- GitHub contributors list
- Release notes mentions
- Community spotlights
- Maintainer status (for consistent contributors)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to reach out:
- Open a discussion on GitHub
- Email: contribute@yourdomain.com
- Check our FAQ in the wiki

---

Thank you for contributing to BugBattle! Every contribution, no matter how small, helps make the platform better for everyone.
