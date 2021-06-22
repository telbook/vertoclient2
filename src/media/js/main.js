// our main function
(function () {
  var vertoHandle, vertoCallbacks, currentCall;
  $.verto.init({}, bootstrap);
  function bootstrap(status) {
    // Create a new verto instance:
    // This step performs a user login to FreeSWITCH via secure websocket.
    // The user must be properly configured in the FreeSWITCH user directory.
    vertoHandle = new jQuery.verto(
      {
        login: "hungnt@netmeeting.netnam.vn",
        passwd: "hungnt@1989",
        // As configured in verto.conf.xml on the server.
        socketUrl: "wss://nm-srv01.netnam.vn:8082",
        // TODO: Where is this file, on the server? What is the base path?
        ringFile: "sounds/bell_ring2.wav",
        // STUN/TURN server config, more than one is allowed.
        // Instead of an array of objects, you can also pass a Boolean value,
        // false disables STUN, true uses the default Google STUN servers.
        iceServers: [
          {
            url: "stun:meeting2.netnam.vn:3478",
          },
        ],
        // These can be set per-call as well as per-login. They can also be set to
        // A specific device ID, or 'none' to disable that particular element of
        // the media flow.
        deviceParams: {
          // Set to 'none' to disable outbound audio.
          useMic: "any",
          // Set to 'none' to disable inbound audio.
          useSpeak: "any",
          // Set to 'none' to disable outbound video.
          useCamera: "any",
        },
        // Optional Id of the HTML audio/video tag to be used for playing video/audio.
        // This can even be a function which will return an element id. (Use this as
        // function to create unique element for every new call specially when dealing
        // with multiple calls simultaneously to avoid conflicts between streams.
        // In this case, once call is finished, newly generated element will be
        // destroyed automatically)
        tag: "video-container",
        // ID of HTML video tag where the video feed is placed.
        deviceParams: {
          // Asking for camera permissions and devices.
          useCamera: "any",
          useMic: "any",
          useSpeak: "any",
        },
        // Below are some more advanced configuration parameters.
        // Google Chrome specific adjustments/filters for audio.
        // Official documentation is scant, best to try them out and see!
        //audioParams: {
        //  googEchoCancellation: true,
        //  googAutoGainControl: true,
        //  googNoiseSuppression: true,
        //  googHighpassFilter: true,
        //  googTypingNoiseDetection: true,
        //  googEchoCancellation2: false,
        //  googAutoGainControl2: false,
        //},
        // Internal session ID used by Verto to track the call, eg. for call
        // recovery. A random one will be generated if none is provided, and,
        // it can be useful to provide a custom ID to store and reference for
        // other purposes.
        //sessid: sessid,
      },
      vertoCallbacks
    );
    document.getElementById("make-call").addEventListener("click", makeCall);
    document
      .getElementById("hang-up-call")
      .addEventListener("click", hangupCall);
  }

  vertoCallbacks = {
    onWSLogin: onWSLogin,
    onWSClose: onWSClose,
    onDialogState: onDialogState,
  };

  function onWSLogin(verto, success) {
    console.log("onWSLogin", success);
  }

  function onWSClose(verto, success) {
    console.log("onWSClose", success);
  }

  function onDialogState(d) {
    switch (d.state.name) {
      case "trying":
        break;
      case "answering":
        break;
      case "active":
        break;
      case "hangup":
        console.log("Call ended with cause: " + d.cause);
        break;
      case "destroy":
        break;
    }
  }

  function makeCall() {
    // Sets the parameters for the video stream that will be sent to the
    // videoconference.
    // Hint: Use the upKPS result from a bandwidth test to determine the video
    // resolution to send!
    vertoHandle.videoParams({
      // Dimensions of the video feed to send.
      minWidth: 320,
      minHeight: 240,
      maxWidth: 720,
      maxHeight: 1280,
      // The minimum frame rate of the client camera, Verto will fail if it's
      // less than this.
      minFrameRate: 15,
      // The maximum frame rate to send from the camera.
      vertoBestFrameRate: 30,
    });
    currentCall = vertoHandle.newCall({
      // Extension to dial.
      destination_number: "8299",
      caller_id_name: "Test Guy",
      caller_id_number: "1008",
      outgoingBandwidth: "default",
      incomingBandwidth: "default",
      // Enable stereo audio.
      useStereo: true,
      // Set to false to disable inbound video.
      // Enable video support.
      useVideo: true,
      // Mirror local user's webcam.
      mirrorInput: true,
      // You can pass any application/call specific variables here, and they will
      // be available as a dialplan variable, prefixed with 'verto_dvar_'.
      userVariables: {
        // Shows up as a 'verto_dvar_email' dialplan variable.
        email: "test@test.com",
      },
      // Use a dedicated outbound encoder for this user's video.
      // NOTE: This is generally only needed if the user has some kind of
      // non-standard video setup, and is not recommended to use, as it
      // dramatically increases the CPU usage for the conference.
      dedEnc: false,
      // Example of setting the devices per-call.
      //useMic: 'any',
      //useSpeak: 'any',
    });
  }
  function hangupCall() {
    currentCall.hangup();
  }
})();
