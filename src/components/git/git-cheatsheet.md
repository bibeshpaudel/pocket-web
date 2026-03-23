# Git & GitHub: The Ultimate Developer Cheatsheet

Git is a distributed version control system that tracks changes in any set of computer files, usually used for coordinating work among programmers. This cheatsheet is designed to give you a strong mental model of how Git works, alongside the practical commands you need every day.

---

## 🧠 Core Concepts

Before memorizing commands, understand these foundational Git concepts:

*   **Repository (Repo):** A database of all your project's files and their history.
*   **Commit:** A snapshot of your repository at a specific point in time.
*   **Branch:** A movable pointer to a specific commit. The default branch is usually `main`.
*   **HEAD:** A pointer indicating your *current* working branch or commit.
*   **Working Directory:** The actual files you see currently on your computer.
*   **Staging Area (Index):** A holding area where you prepare changes before committing them.

### The Three States
Git manages files in three distinct states:
1.  **Modified:** You changed a file but haven't saved it to the staging area yet.
2.  **Staged:** You marked a modified file to go into your next commit.
3.  **Committed:** The data is safely stored in your local Git repository.

---

## ⚙️ Setup & Configuration

**What it does:** Configures your Git environment so your commits are correctly attributed to you.

```bash
# Set your name and email
git config --global user.name "John Doe"
git config --global user.email "john@example.com"

# Set default branch name to main
git config --global init.defaultBranch main

# Check your configuration
git config --list
```

> **💡 Mental Model:** These configurations are saved in a hidden `.gitconfig` file in your home directory. Using `--global` means it applies to all your projects.

---

## 🚀 Basic Workflow

### 1. Initialize a Repository
```bash
git init
```
**What it does:** Creates a hidden `.git` directory to start tracking history in the current folder.

### 2. Check Status
```bash
git status
```
**What it does:** Shows modified files, staged files, and untracked files.
*Use this constantly to know what state your files are in!*

### 3. Stage Changes
```bash
# Stage a specific file
git add filename.txt

# Stage all changed files
git add .
```
**What it does:** Moves changes from the Working Directory into the Staging Area.

### 4. Commit Changes
```bash
git commit -m "Add user authentication feature"
```
**What it does:** Takes everything in the Staging Area and creates a permanent snapshot (commit) in the repository's history.
*Mental Model:* Think of a commit as "saving a checkpoint" in a video game. 

```text
(A)---(B)---(C)  <-- [main, HEAD]
```

---

## 🌿 Branching & Merging

Branching allows you to diverge from the main line of development and continue to do work without messing with that main line.

### Managing Branches

```bash
# List all local branches
git branch

# Create a new branch
git branch feature-login

# Switch to a branch
git switch feature-login

# Create AND switch to a new branch instantly
git switch -c feature-login
```

> **Note:** You can also use `git checkout feature-login` or `git checkout -b feature-login`, but `switch` is the newer, more explicit command just for changing branches.

```text
      (X)---(Y)  <-- [feature-login, HEAD]
     /
(A)---(B)---(C)  <-- [main]
```

### Merging

**What it does:** Combines the history of independent branches together.

```bash
# 1. First, switch to the branch you want to merge INTO (usually main)
git switch main

# 2. Merge the feature branch INTO your current branch
git merge feature-login
```

```text
      (X)---(Y)  <-- [feature-login]
     /         \
(A)---(B)---(C)---(D)  <-- [main, HEAD]
```

---

## ☁️ Remote Repositories

Remotes are versions of your project hosted on the internet (like GitHub, GitLab).

### Connecting to a Remote
```bash
# View existing remotes
git remote -v

# Link your local repo to a remote GitHub repo
git remote add origin https://github.com/user/repo.git
```

### Syncing Changes
```bash
# Download changes from remote but DO NOT merge them
git fetch origin

# Download changes AND automatically merge them into current branch
git pull origin main

# Upload your local commits to the remote branch
git push origin feature-login
```

> **Common Mistake:** Running `git push` without `-u` on a new branch. The first time you push a newly created branch, use `git push -u origin branch-name` to establish the tracking link.

---

## ⏪ Undoing Changes

Mistakes happen. Here are safe ways to undo things.

### Unstaging a File
```bash
# Remove a file from the staging area, but keep your modifications
git restore --staged filename.txt
```

### Discarding Uncommitted Changes
```bash
# DANGER: Permanently wipe out modifications to a file, returning it to the last commit
git restore filename.txt
```

### Amending the Last Commit
```bash
git commit --amend -m "Corrected commit message"
```
**What it does:** Directly modifies the most recent commit. Great for fixing a typo in the message or forgetting to add a file. 
*Warning:* NEVER amend a commit that has already been pushed to a shared remote.

### Reverting Historical Commits
```bash
git revert <commit-hash>
```
**What it does:** Creates a *new* commit that applies the exact opposite changes of the specified commit. This is the **safe** way to undo pushed history.

---

## 📦 Stashing & Temporary Work

When you need to switch branches quickly but aren't ready to commit your current work.

```bash
# Save modified, unstaged changes on a temporary shelf
git stash

# View your list of stashes
git stash list

# Apply the most recently stashed changes back and remove it from the stash list
git stash pop
```

---

## 📜 Logs & History

```bash
# View the commit history
git log

# View a beautifully formatted, single-line graphic tree of your history
git log --oneline --graph --all
```

---

## 🛠️ Advanced: Rebase vs. Merge

### Rebase
```bash
git switch feature-branch
git rebase main
```
**What it does:** Unplugs your feature branch from where it started, and plugs it into the very tip of `main`.
**Mental Model:** It rewrites history to look perfectly linear, as if you wrote your feature exactly *after* the latest changes on `main`.

```text
Before Rebase:
      (X)---(Y)  <-- [feature, HEAD]
     /
(A)---(B)---(C)  <-- [main]

After Rebase:
               (X')---(Y')  <-- [feature, HEAD]
              /
(A)---(B)---(C)  <-- [main]
```

> **The Golden Rule of Rebase:** Never rebase a branch that is shared with other developers (like `main`). Only rebase your local, private feature branches.

---

## ⚠️ Common Mistakes & Fixes

1. **"I committed to the wrong branch!"**
   *Fix:* Run `git reset --soft HEAD~1`. This removes the commit but keeps your files staged. Then `git switch correct-branch` and `git commit` again.

2. **"I have merge conflicts!"**
   *Fix:* Don't panic. Git pauses the merge. Open the conflicting files in your editor, look for `<<<<<<< HEAD`, edit the code to exactly how you want it, save, then `git add .` and `git commit` to finalize.

3. **"I'm stuck in a weird editor interface (Vim) after committing!"**
   *Fix:* Type `:wq` and hit Enter to save and exit. To prevent this, configure a different editor: `git config --global core.editor "code --wait"` (for VS Code).

---

## 🏅 Best Practices

1. **Commit Often, Perfect Later:** Frequently commit small, logical chunks of work. 
2. **Write Good Commit Messages:** Use the imperative mood ("Add login button" not "Added login button"). The first line should be a concise summary (under 50 characters).
3. **Pull Before You Push:** Always sync with the remote repository before attempting to push your code to avoid rejections.
4. **Don't Commit Secrets:** Never commit API keys, passwords, or `.env` files. Always add them to your `.gitignore` file immediately.
