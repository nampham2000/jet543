import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    @property(AudioSource)
    private audioSource: AudioSource;

    @property({ type: [AudioClip] })
    private audioClips: AudioClip[] = [];

    public onAudio(index: number): void {
        let clip: AudioClip = this.audioClips[index];
        this.audioSource.playOneShot(clip);
    }

    
    public offAudio(): void {
       
        this.audioSource.stop();
    }

    public settingAudio(number: number): void {
        this.audioSource.volume = number;
    }
}

