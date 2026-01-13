"use client";

import { cn } from "../../lib/utils";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { useEffect } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (isInView) {
      animate("span", {
        display: "inline-block",
        opacity: 1,
        width: "fit-content",
      }, {
        duration: 0.3,
        delay: stagger(0.1),
        ease: "easeInOut",
      });
    }
  }, [isInView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(`dark:text-white text-black opacity-0 hidden`, word.className)}>
                  {char}
                </motion.span>
              ))}
            </div>
          );
        })}
      </motion.div>
    );
  };
  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}>
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
          cursorClassName
        )}></motion.span>
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  return (
    <div className={cn("flex items-end gap-2 my-6", className)}>
      <motion.div
        className="overflow-hidden"
        initial={{ maxWidth: 0 }}
        whileInView={{ maxWidth: "100%" }}
        viewport={{ once: true }}
        transition={{
          duration: 2,
          ease: "linear",
          delay: 0.5,
        }}
      >
        <div className=" md:mb-3  text-2xl md:text-3xl md:ml-6 lg:text-4xl xl:text-6xl font-bold whitespace-nowrap">
          {wordsArray.map((word, idx) => (
            <span key={idx} className="inline-block">
              {word.text.map((char, i) => (
                <span
                  key={i}
                  className={cn("text-black dark:text-white", word.className)}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Cursor */}
      <motion.span
        className={cn(
          "block w-[4px] rounded-sm bg-blue-500 h-4 sm:h-6 xl:h-20",
          cursorClassName
        )}
        animate={{ opacity: [0, 1] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
};
