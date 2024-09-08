import React from 'react'

export default function EndScreen({showEnd, feedback, time, startGame, reset}) {
    const totalCount = Object.keys(feedback).length
    const correctCount = Object.values(feedback).filter(item => item === "correct").length;

    const startAgain = () => {
        startGame(true);
        reset();
    }

  return (

    <div className='game-container end-screen d-flex align-items-center justify-content-center'>
        <div className='dark-container py-3 px-2'>
            <p className='fw-bold text-gray text-center'>OYUN TAMAMLANDI</p>
            <div className='d-flex align-items-center justify-content-around score-border py-3'>
                <div>
                    <p className='text-blue fw-bold mb-0'>Skor</p>
                    <p className='mb-0 fw-bold font-size-30 text-white'>{`${correctCount}/${totalCount}`}</p>
                </div>
                <div>
                    <p className='text-blue fw-bold mb-0'>Zaman</p>
                    <p className='mb-0 fw-bold font-size-30 text-white'>{time}<span className='font-size-18'>s</span></p>
                </div>

            </div>
            <div className='text-center start-again-btn font-size-20 fw-bold py-1'>
                Skor Tablosu
            </div>
            <div className='text-center start-again-btn font-size-20 fw-bold py-1' onClick={() => startAgain()}>
                Yeniden Başlat
            </div>
        </div>
    </div>

  )
}
