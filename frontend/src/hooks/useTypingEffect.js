import { useState, useEffect } from 'react';

export default function useTypingEffect(words, options = {}) {
  const { typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000 } = options;

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentWord = words[currentWordIndex];

  useEffect(() => {
    const adjustSpeed = isDeleting ? deletingSpeed : typingSpeed;
    const pause = !isDeleting && displayedText.length === currentWord.length;

    if (pause) {
      const timer = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timer);
    }

    if (isDeleting && displayedText.length === 0) {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(isDeleting
        ? currentWord.substring(0, displayedText.length - 1)
        : currentWord.substring(0, displayedText.length + 1));
    }, adjustSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentWord, words, typingSpeed, deletingSpeed, pauseTime]);

  return { displayedText, currentWordIndex, isDeleting };
}
