
import React from 'react';
import { useMusicStatus } from '../../hooks/useSoundEngine';
import { useUIState } from '../../hooks/useUIState';

export const MusicStatusOverlay: React.FC = () => {
    const ui = useUIState();
    const status = useMusicStatus();
    const [isPulsing, setIsPulsing] = React.useState(false);

    // Visual pulse when a note triggers
    React.useEffect(() => {
        setIsPulsing(true);
        const timer = setTimeout(() => setIsPulsing(false), 100);
        return () => clearTimeout(timer);
    }, [status.lastTriggerTime]);

    if (!ui.isShowMusicStatusOverlay) return null;

    return (
        <div id="music-debug-overlay" style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: '#00ff00',
            padding: '12px 16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            zIndex: 9999,
            border: `1px solid ${isPulsing ? '#00ff00' : '#444'}`,
            boxShadow: isPulsing ? '0 0 10px #00ff00' : 'none',
            transition: 'all 0.1s ease-out',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minWidth: '200px'
        }}>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #444', paddingBottom: '4px', marginBottom: '4px', color: '#fff' }}>
                SYNTH DIAGNOSTIC
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>LAST INSTR:</span>
                <span style={{ color: isPulsing ? '#fff' : '#00ff00' }}>{status.lastInstrumentName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>NOTE FREQ:</span>
                <span>{status.lastFreq} Hz</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>ACTIVE NODES:</span>
                <span style={{ color: status.activeNodes > 20 ? '#ff0000' : '#00ff00' }}>{status.activeNodes}</span>
            </div>
            <div style={{ marginTop: '4px', fontSize: '10px', color: '#666', fontStyle: 'italic' }}>
                * Flashes on trigger
            </div>
        </div>
    );
};
