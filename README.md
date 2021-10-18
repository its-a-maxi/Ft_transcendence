<div id="top"></div>
<!--
*** Amazing README template from othneildrew
*** https://github.com/othneildrew/Best-README-Template
-->


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1>ft_transcendence</h1>
  <img src="product.gif" />
</div>

<!-- ABOUT THE PROJECT -->
## ℹ️ About The Project

_42 Project_

We were asked to make our own shell, replicating basic functionalities.
Everything was coded in C, respecting [Norminette](https://cdn.intra.42.fr/pdf/pdf/1608/norme.en.pdf) code convention.

### Subject

* [Subject](https://cdn.intra.42.fr/pdf/pdf/32222/en.subject.pdf)

### Architecture
* Tokenize: builds the Command Table (simple commands, IO files) from command line input. Handles input syntax errors.
* Executor: redirects IO and creates pipes if needed. Forks if launching an executable. Handles built-in commands errors.

### Bash Peculiarities
* We don't have a MULTIOS option enabled by default, as is the case in [zsh.](https://thoughtbot.com/blog/input-output-redirection-in-the-shell#zsh-users-take-note)

### Allowed Functions

<details>
  <summary>Expand</summary>
  
- **malloc**
- **free**
- **write**
- **open**
- **read**
- **close**
- **fork** = [Creates a child process.](https://www.geeksforgeeks.org/fork-system-call) [Why is fork used?](https://stackoverflow.com/questions/985051/what-is-the-purpose-of-fork)
- **wait** = [Stops the parent process until the child process exit.](https://www.geeksforgeeks.org/wait-system-call-c/)
- **waitpid** = [The waitpid() function shall be equivalent to wait() if the pid argument is (pid_t)-1 and the options argument is 0. Otherwise, its behavior shall be modified by the values of the pid and options arguments.](https://linux.die.net/man/3/waitpid)
- **wait3, wait4** = [Obsolete.](https://linux.die.net/man/2/wait3)
- **signal** = [Sets a function to handle a signal.](https://www.tutorialspoint.com/c_standard_library/c_function_signal.htm)
- **kill** = [Sends a signal to a process or a group of processes.](https://linux.die.net/man/3/kill)
- **exit** = [Terminates a process immediately, special handle for child processes.](https://www.tutorialspoint.com/c_standard_library/c_function_exit.htm)
- **getcwd** = [Saves the pathname of your current working directory in a string.](https://pubs.opengroup.org/onlinepubs/009695399/functions/getcwd.html)
- **chdir** = [Changes your current working directory.](https://www.geeksforgeeks.org/chdir-in-c-language-with-examples/)
- **stat, lstat, fstat** = [Returns information about a file.](https://man7.org/linux/man-pages/man2/stat.2.html)
  - stat = Standar.
  - lstat = For symbolic links.
  - fstat = Gets the file from a file descriptor.
- **execve** = [Executes a program referred by a variable.](https://man7.org/linux/man-pages/man2/execve.2.html) ([How to use](https://jameshfisher.com/2017/02/05/how-do-i-use-execve-in-c/))
- **dup** = [Creates a copy of a file descriptor using the lowest numbereded unused descriptor.](https://www.geeksforgeeks.org/dup-dup2-linux-system-call/)
- **dup2** = [Creates a copy of a file descriptor using the descriptor number given by the user.](https://www.geeksforgeeks.org/dup-dup2-linux-system-call/)
- **pipe** = [It's used to create inter-process communication.](https://www.geeksforgeeks.org/pipe-system-call/) Interface in minishell?
- **opendir** = [Opens a directory stream.](https://pubs.opengroup.org/onlinepubs/009695399/functions/opendir.html)
- **readdir** = [Returns a pointer to a dirent structure representing the next directory entry in the directory stream.](https://www.man7.org/linux/man-pages/man3/readdir.3.html)
- **closedir** = [Closes the directory stream.](https://linux.die.net/man/3/closedir)
  - opendir, readdir, closedir example [here](https://www.u-cursos.cl/usuario/a735117f257858200f6460e7d8673d7b/mi_blog/r/readdir.pdf)
- **strerror** = [Returns an error message.](https://www.tutorialspoint.com/c_standard_library/c_function_strerror.htm)
- **errno** = Number of last error, its a variable.
</details>

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## 🏃 Quick Start

### Important

* Project has only been tested and runned on macOS systems

### Installation

* Clone the repo
  ```sh
  git clone https://github.com/its-a-maxi/minishell.git
  ```
  
<p align="right">(<a href="#top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## ⌨️ Usage

* Compile
```sh
  make
```

* Run minishell
```sh
  ./minishell
```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTACT -->
## 📫 Contact

Maximo Monroy - monroy.vds@gmail.com

Alejandro León - https://github.com/ElHuaco

Project Link: [https://github.com/its-a-maxi/minishell](https://github.com/its-a-maxi/minishell)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## 🥇 Acknowledgments

* There is a [github repository](https://github.com/Swoorup/mysh) that obeys the order of proceedings pretty nicely. 
* Please make sure to do a `lexer` -> `parser` -> `expander` -> `executor` to make your life easier. [Here](https://www.cs.purdue.edu/homes/grr/SystemsProgrammingBook/Book/Chapter5-WritingYourOwnShell.pdf) is a solid start.
* Make sure that you understand the [shell syntax](https://pubs.opengroup.org/onlinepubs/009695399/utilities/xcu_chap02.html)
* [Making your own shell](https://www.geeksforgeeks.org/making-linux-shell-c/)
* [Subject](https://cdn.intra.42.fr/pdf/pdf/10992/en.subject.pdf)
* [A reference.](https://github.com/pankratdodo/minishell-42)
* [Another one.](https://github.com/R4meau/minishell)
* [Use of ****envp** in main](https://www.quora.com/What-is-the-3rd-parameter-in-the-main-function-char-envp#:~:text=The%20non%2Dportable%2Dbut%2D,As%20always%2C%20I%20recommend%20experimenting.)
* [Pipe and redirection algorithm](https://www.cs.purdue.edu/homes/grr/SystemsProgrammingBook/Book/Chapter5-WritingYourOwnShell.pdf) for A|B|C|D > outfile < infile

<p align="right">(<a href="#top">back to top</a>)</p>

