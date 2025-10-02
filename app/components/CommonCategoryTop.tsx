import React from 'react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useIsMobile } from '../hooks/useIsMobile';

const CommonCategoryTop = ({ title, subtitle, imageSrc, imageAlt}) => {
  const { fs, fsm} = useUniversalFluid();
  const { isMobile} = useIsMobile();
  const autoSize = (size: number) => (isMobile ? fsm(size) : fs(size));
  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center`}
    >
      <div className="justify-center" style={{display: 'block', width: isMobile ? '100%' : '49%'}}>
        <div className="flex justify-center">
          <div
            className={`relative flex flex-col  border-2 border-black rounded-lg w-full md:w-auto`}
            style={{ display: 'block',height: autoSize(129), paddingLeft: isMobile? fsm(0): fs(43), paddingRight: isMobile? fsm(0): fs(43),marginTop: isMobile? fsm(83):0,marginLeft: isMobile? fsm(40):0, marginRight: isMobile? fsm(40):0}}
          >
            <span
              className={`absolute -translate-y-1/2 left-1/2 transform -translate-x-1/2 bg-white text-center font-cairo font-semibold p-2`}
              style={{ fontSize: autoSize(25) }}
            >
              {subtitle}
            </span>
            <div className='h-full w-full flex justify-center items-center'>
              <p
                className={`text-black font-bold italic font-cousine`}
                style={{display: 'block', fontSize: isMobile? fsm(48): fs(61) }}
              >
                {title}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex justify-center `}
        style={{ width: isMobile ? '100%' : '51%', paddingLeft: isMobile ? fsm(35) : fs(0), paddingRight: isMobile ? fsm(35) : fs(0), marginTop: isMobile ? fsm(24) : 0, marginBottom: isMobile ? fsm(56) : 0 }}
      >
        <img
          className="w-full h-full object-cover "
          style={{
            display: 'block',
            height: isMobile? fsm(380): 'auto',
            borderRadius: isMobile
              ? fsm(50) // mobile → সবদিক rounded
              : `${fs(50)} 0 0 ${fs(50)}` // desktop → শুধু left side rounded
          }}
          src={imageSrc}
          alt={imageAlt}
        />
      </div>
    </div>
  );
};

export default CommonCategoryTop;