import Image from 'next/image'

export default function Settings() {
    return (
        <div style={{ background: '#181F2A', minHeight: '100vh', color: '#fff', padding: '2rem' }}>
            <Image src="/relient.png" alt="Settings Logo" width={80} height={80} style={{ marginBottom: '2rem', borderRadius: '12px', background: '#232B3A' }} />
            <div>Settings</div>
        </div>
    )
}