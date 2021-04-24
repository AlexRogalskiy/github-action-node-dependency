# Contribution Guidelines

## Issues/pull requests

### When you find a bug

* **Do not open up a GitHub issue if the bug is a security vulnerability**, and instead to refer to our [security policy][1].

* **Ensure the bug was not already reported** by searching on GitHub under [Issues][2].

* If you're unable to find an open issue addressing the problem, [open a 'Bug' issue][4].
Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample**, or an **executable test case** demonstrating the expected behavior that is not occurring.

### When you write a patch that fixes a bug

* Open a new GitHub pull request with the patch.

* Ensure the PR description clearly describes the problem and solution.
Include the relevant issue number if applicable.

### When you intend to add a new feature or change an existing one

* Suggest your change by [opening a 'Feature request' issue][5] and start writing code.

### When you want to work on an existing issue

**Note:** Please write a quick comment in the corresponding issue and ask if the feature is still relevant and that you want to jump into the implementation.

Check out our [help wanted](https://github.com/AlexRogalskiy/github-action-node-dependency/labels/help%20wanted) or [good first issue](https://github.com/AlexRogalskiy/github-action-node-dependency/labels/good%20first%20issue) labels to find issues we want to move forward on with your help.

We will do our best to respond/review/merge your PR according to priority. We hope that you stay engaged with us during this period to insure QA. Please note that the PR will be closed if there hasn't been any activity for a long time (~ 30 days) to keep us focused and keep the repo clean.

### Reviewing Pull Requests

Another really useful way to contribute to project is to review other peoples Pull Requests. Having feedback from multiple people is really helpful and reduces the overall time to make a final decision about the Pull Request.

### Writing / improving documentation

Our documentation lives on GitHub in the [docs](docs) directory. Do you see a typo or other ways to improve it? Feel free to edit it and submit a Pull Request!

### Providing support

The easiest thing you can do to help us move forward and make an impact on our progress is to simply provide support to other people having difficulties with their projects.

You can do that by replying to [issues on Github](https://github.com/AlexRogalskiy/github-action-node-dependency/issues).

### When you have questions about the source code

* [open an issue][3] with your question.

## Code Style

We aim for clean, consistent code style. We're using ESlint to check for codestyle issues using the eslint/recommended preset.

### Run lint style rules

```
npm run lint:all
```

### Run format style rules

```
npm run format:all
```

### Verifying linting style

```
npm run check:all
```

To help reduce the effort of creating contributions with this style, an [.editorconfig file](http://editorconfig.org/) is provided that your editor may use to override any conflicting global defaults and automate a subset of the style settings.

## Testing

We aim for a (near) 100% test coverage, so make sure your tests cover as much of your code as possible.

### Test coverage

During development, you can easily check coverage by running `npm test`, then opening the `index.html` file inside the `coverage` directory.

Please follow these Testing guidelines when writing your unit tests:

- Include a top-level `describe('ClassName')` block, with the name of the class you are testing
- Inside that top-level `describe()` block, create another `describe('#methodOne()')` block for each class method you might create or modify
- For each method, include an `it('should do something')` test case for each logical edge case in your changes
- As you write tests, check the code coverage and make sure all lines of code are covered. If not, just add more test cases until everything is covered
- For reference and inspiration, please check our `tests` directory

## Code of Conduct

Finally, to make sure you have a pleasant experience while being in our welcoming community, please read our [code of conduct](CODE_OF_CONDUCT.md). It outlines our core values and believes and will make working together a happier experience.

The :zap: [GitHub Team](https://github.com/AlexRogalskiy) Team


[1]: https://github.com/AlexRogalskiy/github-action-node-dependency/security/policy
[2]: https://github.com/AlexRogalskiy/github-action-node-dependency/issues
[3]: https://github.com/AlexRogalskiy/github-action-node-dependency/issues/new
[4]: https://github.com/AlexRogalskiy/github-action-node-dependency/issues/new?assignees=&labels=bug&template=bug_report.md&title=
[5]: https://github.com/AlexRogalskiy/github-action-node-dependency/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=
