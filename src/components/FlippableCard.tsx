import React from 'react';
import { CaseData } from '../lib/supabase';

interface FlippableCardProps {
  cardData: CaseData;
  isFlipped: boolean;
  onFlip: () => void;
}

const FlippableCard: React.FC<FlippableCardProps> = ({ cardData, isFlipped, onFlip }) => {
  return (
    <div className="w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] xl:w-[36rem] aspect-[2/3] perspective-1200 mx-auto">
      <div 
        className={`w-full h-full relative transform-style-preserve-3d transition-transform duration-800 cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={onFlip}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {/* Front Face */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 bg-white"
          style={{ 
            backfaceVisibility: 'hidden',
            backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAMqADAAQAAAABAAAAMgAAAADprG40AAAEIElEQVRoBe2Zz0tbaRjH+z/gRV8o1gZBeiiChhTxFlGEoF5FKyG+iJ56ajf27s6dO3fu3H297t7du/NfQBD01qN4aDQo/AmCgIpVKAoKAnpQ60PnNfM+2Iu5t9sMceDx4eB93od53ud5HvA0z/M9E4j/iQi9c0dJjpzS4j/i5TjP8z3LD2Y9Skl6eGg0l8dTeL91u1tX7u7u8vT01JGREe/7vnNzc+P6+rr3el24urpqfHx8w+PHz3dGR0e/IuKHjY2Nk+fP/+v58+cviGLW3d09OTs765IkYf1+Pz09Pf3/w+fXkZ+fPzY9PS3QW1tbIzs7O/1+f6Orqyvz8/O6urr661fC2/dPjIyMiILo6Oioi4sL6Pf73/g/k+Tq6opEUSIiIjI1NSXkIyMjPj4+PjQ09NdbqOjo6Jg8f/58dXV10Gq1hMPhkCQJY/x+vz9/fHy8vLy0tDSLxSJUVVUpFosJBAKUy+UkEgkKhaLQbrf1db8T+Xz+5uZmPRwO0ev1hMNhhEIhhEIhpqamkEqlhEIh5ubmqlarRUVFRVRVVaFWqwn5/PnzW1tb0el0RkdHR0dHn5ubw+PHz49GRkaU3W5/++Xn54dDocDpdMLj8cjPzw+Hw0G73W5tbQ25XK5araqrq1u3bq1s2bKltLS0trb26dOn0mq1WCwW9Xo9zWaTMAwDAEqlEjAbrVYLj8dDqVRyOp0Eg0FDQ0Oam5sDAAQCAd3d3TQbDg4OHjhwwJgxYyZPnvx48OBBvV5PpVIZN27c4MGDB14r5/P5qKgoaDQa5ubmRkdHh4eH+fl8Prdu3crS0hIAYPny5UuWLKFQKJKTk5mamqqrq0tLS8tx48bRH4lEIi8vDwAwevToyZMnjx8/np2dnZmZmZqampeXl5AQEBtLW1AQBKpRITExOXl5dWqwUAYOzYsVavXq2jo4Pf73e73X/xxRd37tzR6XQAAI4fP37+/Pnjx48PHz58uHbtWktLS52dnYRhCAQCKBQKlEolQRBAEATYbDaCIAgAgGAwaGlpiePjYwzDwOVyURRFEARB0HUdgUCAUqmE4ziGYeByucjlcgRBwGazAQDEYhEAwOl0wmKxKJfLRVEUhmGaptF1u0+xWKyBgQEAwLlz57y8PBKJBADg1KlTZs6cqbW1FQBQUVEhEAigu7ubz+cDAMRiMYqiCAaDAoEAwzAURWEYhmEYhmEwGAQA0Ov1oiiKYRgEg0G5XI5lWYZhkMvlFotFhmEQCAQ0NDTIZrNVq1ZBawzDwGazAQBER0eHRkdHyOVyBEFAoVAIBAIURQEAgUAAAEqlkmhvb27ubl4ul5OSkqKhoaGpqUmxWEQoFFIsFhGLxTRN43meb/z7gX2L/x+M9S+8L/yLMAxT8zkYAAAAAElFTkTSuQmCC)'
          }}
        >
          <img 
            src={cardData.icon_url} 
            alt="Card icon"
            className="w-20 h-20 rounded-full object-cover"
          />
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mt-5 leading-tight text-gray-800">
            {cardData.front_title}
          </h2>
        </div>

        {/* Back Face */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-2xl shadow-lg p-6 text-white flex flex-col rotate-y-180"
          style={{ 
            backfaceVisibility: 'hidden',
            backgroundImage: `linear-gradient(160deg, ${cardData.theme[0]} 0%, ${cardData.theme[1]} 100%)`
          }}
        >
          {/* Background Watermark */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 w-4/5 h-4/5 opacity-10 pointer-events-none">
            <img 
              src={cardData.icon_url} 
              alt="Background"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          
          <div className="flex-grow overflow-y-auto pr-4 -mr-4 relative z-10 card-content">
            <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-2 pb-1 border-b border-white border-opacity-30 mt-0">
              看见"为什么"
            </h4>
            <div 
              className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mb-4 break-words"
              dangerouslySetInnerHTML={{ __html: cardData.see_why }}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            />
            
            <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-2 pb-1 border-b border-white border-opacity-30">
              解决方案
            </h4>
            <div 
              className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mb-4 break-words"
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {cardData.solution_list && (
                <div 
                  dangerouslySetInnerHTML={{ __html: cardData.solution_list }}
                  className="text-xs sm:text-sm md:text-base lg:text-lg"
                />
              )}
            </div>
            
            <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-2 pb-1 border-b border-white border-opacity-30">
              神奇变化 ✨
            </h4>
            <div 
              className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mb-3 break-words"
              dangerouslySetInnerHTML={{ __html: cardData.the_change }}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            />
          </div>
          
          <div className="text-center italic pt-3 mt-2 border-t border-white border-opacity-20 flex-shrink-0 relative z-10">
            <p className={`text-xs sm:text-sm md:text-base lg:text-lg m-0 before:content-['"'] after:content-['"'] before:text-xl after:text-xl before:text-yellow-300 after:text-yellow-300 leading-tight`}>
              {cardData.wisdom_quote.replace(/"/g, '')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippableCard;
