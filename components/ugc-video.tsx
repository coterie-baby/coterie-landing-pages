export default function UGCVideo() {
  return (
    <div className="relative w-full h-[75vh]">
      <video
        autoPlay
        muted
        loop
        playsInline
        controls
        src="https://player.vimeo.com/progressive_redirect/playback/1119579050/rendition/720p/file.mp4?loc=external&signature=728907c52d41dbb7fc5ffc32281168626d765f5ced762706f737c378cb7ed311"
        className="w-full h-full object-cover relative z-10"
      ></video>
      <div className="absolute inset-0 w-full h-full bg-black opacity-20 pointer-events-none" />
    </div>
  );
}
