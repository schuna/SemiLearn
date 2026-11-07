/**
 * Chapter 1 reader pilot. English excerpts are from Tony R. Kuphaldt,
 * Lessons In Electric Circuits, Volume III, Chapter 1 (CC BY 4.0).
 * This is a reviewed excerpt set, not a complete translation of the chapter.
 */
window.CH1_READER = {
  source: 'https://www.ibiblio.org/kuphaldt/electricCircuits/Semi/SEMI_1.html',
  license: 'https://www.ibiblio.org/kuphaldt/electricCircuits/Semi/SEMI_A3.html',
  edition: 'Fifth Edition · 2021-11-06',
  pdfSha256: '6734B64B5EB916DA5641218DBD2FAC32F233B9714A11E3C1485F779782B537F1',
  sections: [
    {
      id: 'electric-electronic',
      title: '전기 회로에서 전자 회로로',
      originalTitle: 'From electric to electronic',
      textbookPages: '1–3',
      pdfPage: 10,
      coverage: '본문 번역 완료 · 그림 1.1은 PDF 참조',
      pairs: [
        {
          id: 'volume-transition',
          en: 'This third volume of the book series Lessons In Electric Circuits makes a departure from the former two in that the transition between electric circuits and electronic circuits is formally crossed. Electric circuits are connections of conductive wires and other devices whereby the uniform flow of electrons occurs. Electronic circuits add a new dimension to electric circuits in that some means of control is exerted over the flow of electrons by another electrical signal, either a voltage or a current.',
          ko: '이 교재 시리즈의 제3권은 앞선 두 권과 달리 전기 회로에서 전자 회로로의 경계를 본격적으로 넘어선다. 전기 회로는 도선과 다른 소자를 연결해 전자가 일정하게 흐르도록 한 회로다. 전자 회로는 여기에 새로운 차원을 더한다. 전압이나 전류 같은 다른 전기 신호가 전자의 흐름을 제어한다.',
          note: '여기서 “일정한 흐름”은 개념을 소개하기 위한 교재 표현이다. 뒤의 핵심은 전기 신호가 다른 전기 흐름을 제어한다는 점이다.'
        },
        {
          id: 'mechanical-control',
          en: 'In and of itself, the control of electron flow is nothing new to the student of electric circuits. Switches control the flow of electrons, as do potentiometers, especially when connected as variable resistors (rheostats). Neither the switch nor the potentiometer should be new to your experience by this point in your study.',
          ko: '전자 흐름을 제어한다는 사실 자체는 전기 회로를 공부한 학생에게 새롭지 않다. 스위치도 전자 흐름을 제어하고, 전위차계도 특히 가변저항으로 연결했을 때 같은 역할을 한다. 이 단계의 학습자라면 스위치와 전위차계 모두 이미 익숙할 것이다.',
          note: '전위차계는 접점의 위치를 바꿔 저항을 조절한다.'
        },
        {
          id: 'control-boundary',
          en: 'The threshold marking the transition from electric to electronic, then, is defined by how the flow of electrons is controlled rather than whether or not any form of control exists in a circuit. Switches and rheostats control the flow of electrons according to the positioning of a mechanical device, which is actuated by some physical force external to the circuit.',
          ko: '따라서 전기 회로와 전자 회로의 경계는 회로에 제어 기능이 있는지 여부가 아니라 전자 흐름을 어떤 방식으로 제어하는지에 달려 있다. 스위치와 가변저항은 회로 외부의 물리적 힘으로 움직이는 기계 장치의 위치에 따라 전자 흐름을 제어한다.',
          note: '교재가 사용하는 능동·수동 구분의 맥락이다.'
        },
        {
          id: 'electricity-controls-electricity',
          en: 'In electronics, however, we are dealing with special devices able to control the flow of electrons according to another flow of electrons, or by the application of a static voltage. In other words, in an electronic circuit, electricity is able to control electricity.',
          ko: '전자공학에서는 다른 전자의 흐름이나 일정한 전압을 이용해 전자의 흐름을 제어할 수 있는 특수한 소자를 다룬다. 다시 말해 전자 회로에서는 전기가 다른 전기의 흐름을 제어할 수 있다.',
          note: '스위치도 전류를 제어하지만, 교재가 강조하는 경계는 제어 신호가 기계적 위치인지 전압·전류 같은 전기적 신호인지에 있다.'
        },
        {
          id: 'edison-effect',
          en: 'The historic precursor to the modern electronics era was invented by Thomas Edison in 1880 while developing the electric incandescent lamp. Edison found that a small current passed from the heated lamp filament to a metal plate mounted inside the vacuum envelop. (Figure 1.1 (a)) Today this is known as the “Edison effect”. Note that the battery is only necessary to heat the filament. Electrons would still flow if a non-electrical heat source was used.',
          ko: '현대 전자공학의 역사적 선구는 토머스 에디슨이 1880년 백열전구를 개발하던 중 발견한 현상이다. 그는 가열된 필라멘트에서 진공 용기 안의 금속판으로 작은 전류가 흐른다는 것을 알아냈다(그림 1.1(a)). 오늘날 이를 “에디슨 효과”라고 한다. 배터리는 필라멘트를 가열하는 데만 필요하며, 전기가 아닌 열원으로 가열해도 전자는 흐른다.',
          note: '그림 1.1의 전극 구조와 전자 이동 방향은 PDF 2쪽(뷰어 11쪽)에서 확인할 수 있다.'
        },
        {
          id: 'fleming-deforest',
          en: 'By 1904 Marconi Wireless Company adviser John Flemming found that an externally applied current (plate battery) only passed in one direction from filament to plate (Figure 1.1 (b)), but not the reverse direction (not shown). This invention was the vacuum diode, used to convert alternating currents to DC. The addition of a third electrode by Lee DeForest (Figure 1.1 (c)) allowed a small signal to control the larger electron flow from filament to plate.',
          ko: '1904년 마르코니 무선회사의 고문 존 플레밍은 외부에서 전압을 가했을 때 필라멘트에서 금속판 방향으로만 전류가 흐르고(그림 1.1(b)), 반대 방향으로는 흐르지 않는다는 것을 알아냈다. 이것이 교류를 직류로 바꾸는 데 쓰인 진공 다이오드다. 리 디포리스트가 세 번째 전극을 추가하자(그림 1.1(c)) 작은 신호로 필라멘트에서 금속판으로 흐르는 더 큰 전자 흐름을 제어할 수 있게 되었다.',
          note: '전류와 전자 흐름의 방향은 서로 반대다. 교재의 역사 설명은 원문 표현에 따라 번역했다.'
        },
        {
          id: 'audion',
          en: 'Historically, the era of electronics began with the invention of the Audion tube, a device controlling the flow of an electron stream through a vacuum by the application of a small voltage between two metal structures within the tube. A more detailed summary of so-called electron tube or vacuum tube technology is available in the last chapter of this volume for those who are interested.',
          ko: '역사적으로 전자공학 시대는 오디온 진공관의 발명과 함께 시작되었다. 이 소자는 진공관 안의 두 금속 구조물 사이에 작은 전압을 걸어 진공 속 전자 흐름을 제어한다. 전자관 또는 진공관 기술에 대한 더 자세한 설명은 이 책의 마지막 장에 있다.',
          note: 'Ch 13은 추후 콘텐츠 범위다.'
        },
        {
          id: 'transistor',
          en: 'Electronics technology experienced a revolution in 1948 with the invention of the transistor. This tiny device achieved approximately the same effect as the Audion tube, but in a vastly smaller amount of space and with less material. Transistors control the flow of electrons through solid semiconductor substances rather than through a vacuum, and so transistor technology is often referred to as solid-state electronics.',
          ko: '1948년 트랜지스터가 발명되면서 전자 기술에 혁명이 일어났다. 이 작은 소자는 오디온 진공관과 대체로 같은 효과를 훨씬 작은 공간과 적은 재료로 구현했다. 트랜지스터는 진공이 아니라 고체 반도체 물질을 통한 전자 흐름을 제어하므로, 트랜지스터 기술을 고체 전자공학이라고도 부른다.',
          note: '진공관과 반도체의 물리적 전도 메커니즘은 다르며 여기서는 제어 기능을 비교한다.'
        }
      ]
    },
    {
      id: 'active-passive',
      title: '능동 소자와 수동 소자',
      originalTitle: 'Active versus passive devices',
      textbookPages: '3',
      pdfPage: 12,
      coverage: '본문 번역 완료',
      pairs: [
        {
          id: 'active-definition',
          en: 'An active device is any type of circuit component with the ability to electrically control electron flow (electricity controlling electricity). In order for a circuit to be properly called electronic, it must contain at least one active device. Components incapable of controlling current by means of another electrical signal are called passive devices. Resistors, capacitors, inductors, transformers, and even diodes are all considered passive devices.',
          ko: '능동 소자는 전기적 방법으로 전자 흐름을 제어할 수 있는 회로 부품이다. 즉 전기가 전기를 제어한다. 회로를 전자 회로라고 부르려면 적어도 하나의 능동 소자가 있어야 한다. 다른 전기 신호를 이용해 전류를 제어할 수 없는 부품은 수동 소자라 한다. 저항, 커패시터, 인덕터, 변압기, 심지어 다이오드도 모두 수동 소자로 간주한다.',
          note: '이 교재의 분류에서 다이오드는 수동 소자다. “외부 전원이 필요한가”만으로 능동·수동을 나누지 않는다.'
        },
        {
          id: 'active-examples',
          en: 'Active devices include, but are not limited to, vacuum tubes, transistors, silicon-controlled rectifiers (SCRs), and TRIACs. A case might be made for the saturable reactor to be defined as an active device, since it is able to control an AC current with a DC current, but I’ve never heard it referred to as such. The operation of each of these active devices will be explored in later chapters of this volume.',
          ko: '능동 소자에는 진공관, 트랜지스터, 실리콘 제어 정류기(SCR), 트라이액 등이 있다. 직류 전류로 교류 전류를 제어할 수 있다는 점에서 포화 리액터도 능동 소자로 볼 여지가 있지만, 저자는 실제로 그렇게 부르는 경우를 들어본 적이 없다고 한다. 이 능동 소자들의 동작은 이 책의 뒤 장에서 다룬다.',
          note: '포화 리액터는 자기 포화로 교류 경로의 인덕턴스를 바꾸는 장치다.'
        },
        {
          id: 'voltage-current-control',
          en: 'All active devices control the flow of electrons through them. Some active devices allow a voltage to control this current while other active devices allow another current to do the job. Devices utilizing a static voltage as the controlling signal are, not surprisingly, called voltage-controlled devices. Devices working on the principle of one current controlling another current are known as current-controlled devices.',
          ko: '모든 능동 소자는 그 안을 통과하는 전자 흐름을 제어한다. 어떤 소자는 전압으로 이 전류를 제어하고, 다른 소자는 또 다른 전류로 제어한다. 일정한 전압을 제어 신호로 사용하는 소자는 전압 제어 소자, 한 전류가 다른 전류를 제어하는 원리로 동작하는 소자는 전류 제어 소자라고 부른다.',
          note: '이 구분은 제어 입력의 종류를 말하며, 회로 전체의 전력 공급 방식과는 다르다.'
        },
        {
          id: 'device-examples',
          en: 'For the record, vacuum tubes are voltage-controlled devices while transistors are made as either voltage-controlled or current controlled types. The first type of transistor successfully demonstrated was a current-controlled device.',
          ko: '진공관은 전압 제어 소자이며, 트랜지스터는 전압 제어형과 전류 제어형 모두 만들어진다. 처음으로 성공적으로 실증된 트랜지스터는 전류 제어형이었다.',
          note: '뒤 장에서 BJT와 FET를 비교할 때 이 분류를 다시 사용할 수 있다.'
        }
      ]
    },
    {
      id: 'amplifiers',
      title: '증폭기와 외부 전원',
      originalTitle: 'Amplifiers',
      textbookPages: '3–6',
      pdfPage: 12,
      coverage: '주요 본문 번역 · 그림 1.2–1.5와 일부 예시 미번역',
      pairs: [
        {
          id: 'small-controls-large',
          en: 'The practical benefit of active devices is their amplifying ability. Whether the device in question be voltage-controlled or current-controlled, the amount of power required of the controlling signal is typically far less than the amount of power available in the controlled current. In other words, an active device doesn’t just allow electricity to control electricity; it allows a small amount of electricity to control a large amount of electricity.',
          ko: '능동 소자의 실용적 이점은 증폭 능력에 있다. 전압 제어형이든 전류 제어형이든 제어 신호에 필요한 전력은 제어 대상 전류에서 이용할 수 있는 전력보다 대체로 훨씬 작다. 즉 능동 소자는 전기가 전기를 제어하게 할 뿐 아니라, 작은 전력으로 큰 전력을 제어하게 한다.',
          note: '“제어”와 “에너지 공급”은 다른 역할이다. 출력 에너지를 공급하는 전원은 뒤에서 따로 설명한다.'
        },
        {
          id: 'amplification-definition',
          en: 'Because of this disparity between controlling and controlled powers, active devices may be employed to govern a large amount of power (controlled) by the application of a small amount of power (controlling). This behavior is known as amplification.',
          ko: '제어하는 전력과 제어받는 전력의 차이 덕분에 능동 소자를 이용하면 작은 제어 전력을 가해 큰 전력을 조절할 수 있다. 이러한 동작을 증폭이라고 한다.',
          note: '증폭은 입력의 작은 변화가 더 큰 출력 변화에 대응하도록 만드는 동작이다.'
        },
        {
          id: 'energy-conservation',
          en: 'It is a fundamental rule of physics that energy can neither be created nor destroyed. Stated formally, this rule is known as the Law of Conservation of Energy, and no exceptions to it have been discovered to date. If this Law is true -- and an overwhelming mass of experimental data suggests that it is -- then it is impossible to build a device capable of taking a small amount of energy and magically transforming it into a large amount of energy.',
          ko: '에너지는 생성되거나 소멸하지 않는다는 것이 물리학의 기본 법칙이다. 이를 에너지 보존 법칙이라고 하며, 지금까지 예외는 발견되지 않았다. 방대한 실험 결과가 뒷받침하는 이 법칙이 맞다면, 적은 에너지를 받아 마술처럼 많은 에너지로 바꾸는 장치는 만들 수 없다.',
          note: '증폭기의 출력 전력과 입력 신호 전력만 비교하면 외부 전원에서 들어오는 전력을 빠뜨리기 쉽다.'
        },
        {
          id: 'machine-losses',
          en: 'All machines, electric and electronic circuits included, have an upper efficiency limit of 100 percent. At best, power out equals power in as in Figure 1.2. Usually, machines fail even to meet this limit, losing some of their input energy in the form of heat which is radiated into surrounding space and therefore not part of the output energy stream.',
          ko: '전기·전자 회로를 포함한 모든 기계의 효율 상한은 100%다. 가장 이상적인 경우에도 출력 전력은 입력 전력과 같다(그림 1.2). 실제 기계는 보통 이 상한에도 미치지 못한다. 입력 에너지의 일부가 주변으로 방출되는 열이 되어 원하는 출력 에너지에 포함되지 않기 때문이다.',
          note: '원문의 손실 설명은 그림 1.3으로 이어진다. 여기서 “입력”에는 신호뿐 아니라 전원 에너지도 포함해야 한다.'
        },
        {
          id: 'power-source',
          en: 'The Law of Conservation of Energy is not violated because the additional power is supplied by an external source, usually a DC battery or equivalent.',
          ko: '추가 출력에 필요한 전력은 보통 직류 배터리나 이에 상응하는 외부 전원에서 공급되므로 에너지 보존 법칙에 어긋나지 않는다.',
          note: '입력 신호는 출력 파형의 모양을 제어한다. 커진 출력 에너지는 입력 신호 자체에서 생겨나는 것이 아니다.'
        },
        {
          id: 'dc-power-shaping',
          en: 'In other words, the current-controlling behavior of active devices is employed to shape DC power from the external power source into the same waveform as the input signal, producing an output signal of like shape but different (greater) power magnitude. The transistor or other active device within an amplifier merely forms a larger copy of the input signal waveform out of the “raw” DC power provided by a battery or other power source.',
          ko: '다시 말해 능동 소자의 전류 제어 동작을 이용해 외부 전원에서 온 직류 전력을 입력 신호와 같은 파형으로 빚어낸다. 그 결과 모양은 비슷하지만 전력은 더 큰 출력 신호가 만들어진다. 증폭기 안의 트랜지스터나 다른 능동 소자는 배터리 등 전원에서 공급된 직류 전력으로 입력 파형의 더 큰 복사본을 형성한다.',
          note: '실제 증폭기는 전원 레일과 소자 한계 때문에 입력 파형을 무한히 키울 수 없다. 인터랙티브 랩의 클리핑을 확인할 수 있다.'
        },
        {
          id: 'power-steering',
          en: 'The requirement of an external source of power is common to all types of amplifiers, electrical and non-electrical. A common example of a non-electrical amplification system would be power steering in an automobile, amplifying the power of the driver’s arms in turning the steering wheel to move the front wheels of the car. The source of power necessary for the amplification comes from the engine.',
          ko: '외부 동력원이 필요하다는 점은 전기식이든 비전기식이든 모든 증폭기에 공통적이다. 비전기식 증폭의 흔한 예는 자동차의 파워 스티어링이다. 운전자가 핸들을 돌릴 때 팔로 가하는 힘의 효과를 키워 앞바퀴를 움직인다. 이 증폭에 필요한 동력은 엔진에서 온다.',
          note: '운전자의 힘은 제어 입력, 엔진은 에너지원에 해당한다.'
        }
      ]
    },
    {
      id: 'amplifier-gain',
      title: '증폭 이득',
      originalTitle: 'Amplifier gain',
      textbookPages: '6–8',
      pdfPage: 15,
      coverage: '주요 본문·예제 번역 · 교재 수식 이미지·그림 1.6 미번역',
      formulas: [
        { name: '전압·전류·전력 이득', expression: 'Aᵥ = Vout / Vin  ·  Aᵢ = Iout / Iin  ·  Aₚ = Pout / Pin', condition: '각 비율의 입력·출력은 같은 물리량과 같은 AC 또는 DC 기준으로 비교' },
        { name: '다단 이득', expression: 'A전체 = A₁ × A₂ × … × Aₙ', condition: '각 단을 연결하고 같은 종류의 이득을 곱할 때' }
      ],
      pairs: [
        {
          id: 'gain-definition',
          en: 'Because amplifiers have the ability to increase the magnitude of an input signal, it is useful to be able to rate an amplifier’s amplifying ability in terms of an output/input ratio. The technical term for an amplifier’s output/input magnitude ratio is gain. As a ratio of equal units (power out / power in, voltage out / voltage in, or current out / current in), gain is naturally a unitless measurement. Mathematically, gain is symbolized by the capital letter “A”.',
          ko: '증폭기는 입력 신호의 크기를 키울 수 있으므로 출력과 입력의 비로 그 능력을 평가하면 유용하다. 증폭기의 출력 크기와 입력 크기의 비를 이득이라고 한다. 전력끼리, 전압끼리 또는 전류끼리 나눈 비이므로 이득에는 단위가 없다. 수학적으로는 대문자 A로 나타낸다.',
          note: '전압 이득, 전류 이득, 전력 이득은 서로 다른 비율이다. AC와 DC 신호에 대한 이득도 구분해서 읽어야 한다.'
        },
        {
          id: 'voltage-gain-example',
          en: 'For example, if an amplifier takes in an AC voltage signal measuring 2 volts RMS and outputs an AC voltage of 30 volts RMS, it has an AC voltage gain of 30 divided by 2, or 15:',
          ko: '예를 들어 증폭기에 실효값 2 V의 교류 전압을 입력했을 때 실효값 30 V가 출력되면, 교류 전압 이득은 30을 2로 나눈 15다.',
          note: '전압비 계산에서는 입력과 출력 모두 RMS처럼 같은 척도를 사용해야 한다.'
        },
        {
          id: 'current-gain-example',
          en: 'Correspondingly, if we know the gain of an amplifier and the magnitude of the input signal, we can calculate the magnitude of the output. For example, if an amplifier with an AC current gain of 3.5 is given an AC input signal of 28 mA RMS, the output will be 3.5 times 28 mA, or 98 mA:',
          ko: '반대로 증폭기의 이득과 입력 신호 크기를 알면 출력 크기를 계산할 수 있다. 예를 들어 교류 전류 이득이 3.5인 증폭기에 실효값 28 mA의 교류 전류를 입력하면 출력은 3.5×28 mA, 즉 98 mA가 된다.',
          note: 'Aᵢ = Iout/Iin이므로 Iout = Aᵢ×Iin이다.'
        },
        {
          id: 'ac-dc-distinction',
          en: 'In the last two examples I specifically identified the gains and signal magnitudes in terms of “AC.” This was intentional, and illustrates an important concept: electronic amplifiers often respond differently to AC and DC input signals, and may amplify them to different extents. Another way of saying this is that amplifiers often amplify changes or variations in input signal magnitude (AC) at a different ratio than steady input signal magnitudes (DC).',
          ko: '앞의 두 예제에서 이득과 신호 크기를 일부러 “교류”라고 밝혔다. 이는 중요한 개념을 보여준다. 전자 증폭기는 교류 입력과 직류 입력에 다르게 반응하고 서로 다른 비율로 증폭할 수 있다. 다시 말해 입력의 변화분(교류)에 대한 이득이 일정한 입력값(직류)에 대한 이득과 다를 수 있다.',
          note: 'DC 동작점과 AC 작은 신호 이득을 혼동하지 않도록 한다.'
        },
        {
          id: 'gain-kind',
          en: 'The specific reasons for this are too complex to explain at this time, but the fact of the matter is worth mentioning. If gain calculations are to be carried out, it must first be understood what type of signals and gains are being dealt with, AC or DC. Electrical amplifier gains may be expressed in terms of voltage, current, and/or power, in both AC and DC.',
          ko: '이 차이의 구체적인 이유는 여기서 다루기에는 복잡하지만, 계산 전에 알아둘 만하다. 이득을 계산할 때는 먼저 대상 신호와 이득이 교류인지 직류인지 확인해야 한다. 전기 증폭기의 이득은 교류와 직류 각각에 대해 전압, 전류, 전력으로 나타낼 수 있다.',
          note: '이득이라는 한 단어만 보고 어떤 물리량의 비율인지 추정하지 않는다.'
        },
        {
          id: 'cascaded-gain',
          en: 'If multiple amplifiers are staged, their respective gains form an overall gain equal to the product (multiplication) of the individual gains. If a 1 V signal were applied to the input of the gain of 3 amplifier in Figure 1.6, a 3 V signal out of the first amplifier would be further amplified by a gain of 5 at the second stage yielding 15 V at the final output.',
          ko: '증폭기를 여러 단으로 연결하면 전체 이득은 각 단 이득의 곱이다. 그림 1.6에서 이득 3인 첫 번째 증폭기에 1 V를 입력하면 3 V가 나오고, 이 신호가 이득 5인 두 번째 단을 지나면 최종 출력은 15 V가 된다.',
          note: '첫 단 3배 × 둘째 단 5배 = 전체 15배다. 데시벨로 나타내면 각 단의 dB 값을 더한다.'
        }
      ]
    },
    {
      id: 'decibels',
      title: '데시벨',
      originalTitle: 'Decibels',
      textbookPages: '8–14',
      pdfPage: 17,
      coverage: '핵심 본문·계산 예제 번역 · 표·그림과 나머지 본문 미번역',
      formulas: [
        { name: '전력비 데시벨', expression: 'Gₚ(dB) = 10 log₁₀(Pout / Pin)', condition: 'Pout, Pin > 0; 입력과 출력 전력의 비' },
        { name: '전압비 데시벨', expression: 'Gᵥ(dB) = 20 log₁₀(|Vout / Vin|)', condition: '입력·출력 임피던스가 같을 때 전력 이득과 같은 dB 값' }
      ],
      pairs: [
        {
          id: 'bel-definition',
          en: 'Now, it is defined in terms of the common (base 10) logarithm of a power ratio (output power divided by input power):',
          ko: '오늘날 벨은 전력비, 즉 출력 전력을 입력 전력으로 나눈 값의 상용로그로 정의된다.',
          note: '전력 이득은 10 log₁₀(Pout/Pin) dB다. 같은 임피던스에서 측정한 전압비라면 20 log₁₀(Vout/Vin) dB가 된다.'
        },
        {
          id: 'decibel-prefix',
          en: 'It was later decided that the bel was too large of a unit to be used directly, and so it became customary to apply the metric prefix deci (meaning 1/10) to it, making it decibels, or dB.',
          ko: '나중에 벨은 그대로 사용하기에 단위가 너무 크다고 판단되어, 10분의 1을 뜻하는 접두사 데시를 붙인 데시벨(dB)이 관례적으로 쓰이게 되었다.',
          note: '1 B = 10 dB다.'
        },
        {
          id: 'db-cascade',
          en: 'Ratio gain figures are multiplicative for staged amplifiers, but gains expressed in bels add rather than multiply to equal the overall system gain.',
          ko: '여러 증폭단의 비율 이득은 서로 곱하지만, 벨로 표현한 이득은 서로 더해서 전체 시스템 이득을 구한다.',
          note: '데시벨도 같은 로그 성질을 사용한다. 예를 들어 3배와 5배의 전력 이득은 합쳐서 15배이고 dB 값은 각각의 값을 더한다.'
        },
        {
          id: 'voltage-square',
          en: 'For a constant load impedance, a voltage or current gain of 2 equates to a power gain of 4 (2²); a voltage or current gain of 3 equates to a power gain of 9 (3²).',
          ko: '부하 임피던스가 일정할 때 전압이나 전류가 2배가 되면 전력은 4배, 3배가 되면 전력은 9배가 된다.',
          note: '제곱 관계 때문에 전압비 또는 전류비의 데시벨 계산에는 10 대신 20이 곱해진다.'
        },
        {
          id: 'db-example',
          en: 'Example: Power into an amplifier is 1 Watt, the power out is 10 Watts. Find the power gain in dB.',
          ko: '예제: 증폭기에 입력되는 전력이 1 W이고 출력 전력이 10 W일 때 전력 이득을 dB로 구하라.',
          note: '10 log₁₀(10/1) = 10 dB다. 역으로 20 dB의 전력 이득은 전력비 100배다.'
        }
      ]
    },
    {
      id: 'absolute-db',
      title: '절대 데시벨 척도',
      originalTitle: 'Absolute dB scales',
      textbookPages: '14–16',
      pdfPage: 23,
      coverage: '핵심 본문 번역 · 음향 척도 세부·그림 미번역',
      formulas: [
        { name: 'dBm 절대 전력', expression: 'P(dBm) = 10 log₁₀(P / 1 mW)', condition: 'P > 0; 기준 전력 1 mW는 부하 저항과 무관' },
        { name: '전압 환산', expression: 'Vᵣₘₛ = √(P × R)', condition: '저항성 부하에서 P와 R을 알고 있을 때' }
      ],
      pairs: [
        {
          id: 'absolute-reference',
          en: 'It is also possible to use the decibel as a unit of absolute power, in addition to using it as an expression of power gain or loss. In cases like these, the measurement is made in reference to some standardized power level defined as 0 dB.',
          ko: '데시벨은 전력의 이득·손실뿐 아니라 기준값을 정한 절대 전력의 표기에도 사용할 수 있다. 이때는 표준 전력 수준을 0 dB로 정하고 그 기준에 대해 측정한다.',
          note: 'dB만 적으면 상대적인 비인지 어떤 기준을 둔 값인지 문맥을 확인해야 한다.'
        },
        {
          id: 'dbm-reference',
          en: 'The reference point, 0 dBm, is defined as 1 milliwatt of electrical power dissipated by a 600 Ω load.',
          ko: '교재의 600 Ω 부하 예에서 기준점인 0 dBm은 부하에서 소비되는 전력 1 mW로 정의된다.',
          note: 'dBm의 기준 전력은 1 mW다. 600 Ω은 교재가 설명하는 전압계 예의 부하 조건이며 dBm 자체의 필수 조건은 아니다. 같은 1 mW는 50 Ω에서는 약 0.224 V RMS다.'
        },
        {
          id: 'dbm-voltage-example',
          en: 'Some AC voltmeters come equipped with a dBm range or scale (sometimes labeled “DB”) intended for use in measuring AC signal power across a 600 Ω load.',
          ko: '일부 교류 전압계에는 600 Ω 부하에 걸린 교류 신호 전력을 측정하기 위한 dBm 눈금(때로는 DB라고 표시)이 있다.',
          note: '0 dBm = 1 mW를 600 Ω에 대입하면 √(0.001 W × 600 Ω) ≈ 0.7746 V RMS다.'
        },
        {
          id: 'rf-50-ohm',
          en: 'Radio frequency power measurements for low level signals encountered in radio receivers use dBm measurements referenced to a 50 Ω load.',
          ko: '무선 수신기의 작은 신호 전력을 측정할 때는 50 Ω 부하를 기준으로 dBm 측정을 사용한다.',
          note: '기준 전력 1 mW는 같고, 전압으로 환산할 때 사용하는 저항값만 달라진다.'
        },
        {
          id: 'dbw-reference',
          en: 'Such is the case for the dBW scale, with a reference point of 0 dBW established at 1 Watt.',
          ko: '그 예가 dBW 척도로, 0 dBW의 기준 전력은 1 W다.',
          note: '0 dBW = 30 dBm이다.'
        }
      ]
    },
    {
      id: 'attenuators',
      title: '감쇠기',
      originalTitle: 'Attenuators',
      textbookPages: '16–26',
      pdfPage: 25,
      coverage: '개요·7개 소절 발췌 번역 · 본문·표·회로도 미번역',
      formulas: [
        { name: '전력 감쇠량', expression: 'L(dB) = 10 log₁₀(Pin / Pout)', condition: 'Pin, Pout > 0; 손실을 양수로 표시하는 교재의 감쇠량 표기' },
        { name: '전압 감쇠량', expression: 'L(dB) = 20 log₁₀(|Vin / Vout|)', condition: '입력·출력에서 비교하는 저항이 같을 때' }
      ],
      pairs: [
        {
          id: 'attenuator-definition',
          en: 'Attenuators are passive devices.',
          ko: '감쇠기는 수동 소자다.',
          note: '감쇠기는 신호를 줄인다. T형·Π형 회로의 저항값은 원하는 감쇠량뿐 아니라 신호원·부하 임피던스에 맞춰 정한다.'
        }
      ],
      subsections: [
        { id: 'attenuator-db', title: '1.7.1 데시벨', pdfPage: 26, en: 'A 10 dB attenuator followed by a 6 dB attenuator provides 16dB of attenuation overall.', ko: '10 dB 감쇠기 뒤에 6 dB 감쇠기를 연결하면 전체 감쇠량은 16 dB다.', note: '감쇠량을 양수로 표기한 예다. 전압비 K = Vin/Vout는 곱한다.' },
        { id: 'attenuator-t', title: '1.7.2 T형 감쇠기', pdfPage: 28, en: 'The T (and below Π) configurations are most commonly used as they provide bidirectional matching.', ko: 'T형과 아래의 Π형 구성이 가장 흔히 쓰이는 이유는 양방향 임피던스 정합이 가능하기 때문이다.', note: '교재의 50 Ω 예제에서 입력·출력을 바꿔도 같은 정합과 감쇠량을 얻는다.' },
        { id: 'attenuator-pi', title: '1.7.3 Π형 감쇠기', pdfPage: 29, en: 'The resistors corresponding to other attenuation levels may be calculated from the equations.', ko: '표에 없는 감쇠량에 필요한 저항값은 제시된 식으로 계산할 수 있다.', note: 'Π형 회로도와 저항값 표는 해당 PDF 쪽에서 확인한다.' },
        { id: 'attenuator-l', title: '1.7.4 L형 감쇠기', pdfPage: 30, en: 'Note that the resistor values are not the same.', ko: '두 가지 L형 구성의 저항값은 서로 같지 않다는 점에 주의하라.', note: '회로 방향과 직렬·병렬 저항 위치를 확인한 뒤 해당 표를 사용한다.' },
        { id: 'attenuator-bridged-t', title: '1.7.5 브리지 T형 감쇠기', pdfPage: 30, en: 'The bridged-T attenuator is not often used.', ko: '브리지 T형 감쇠기는 자주 쓰이지 않는다.', note: '교재는 50 Ω용 저항값 표와 회로를 제시한다.' },
        { id: 'attenuator-cascade', title: '1.7.6 다단 연결', pdfPage: 32, en: 'Attenuator sections can be cascaded as in Figure 1.19 for more attenuation than may be available from a single section.', ko: '한 단으로 얻을 수 있는 것보다 큰 감쇠량이 필요하면 그림 1.19처럼 감쇠기 여러 단을 직렬로 연결할 수 있다.', note: '예: 10 dB + 10 dB = 20 dB, 전압 감쇠비는 약 3.16 × 3.16 = 10이다.' },
        { id: 'attenuator-rf', title: '1.7.7 RF 감쇠기', pdfPage: 32, en: 'For radio frequency (RF) work (<1000 Mhz), the individual sections must be mounted in shielded compartments to thwart capacitive coupling if lower signal levels are to be achieved at the highest frequencies.', ko: '무선 주파수 작업(교재의 범위에서는 1000 MHz 미만)에서 높은 주파수까지 낮은 신호 수준을 얻으려면 기생 정전용량을 통한 결합을 막도록 각 단을 차폐 구획에 설치해야 한다.', note: '고주파에서는 저항값뿐 아니라 물리적 구조와 차폐가 성능에 영향을 준다.' }
      ]
    }
  ],
  supplement: {
    title: '왜 전압 이득은 20 log이고, dBm은 600 Ω에 한정되지 않을까?',
    question: '전압을 10배로 만들면 왜 10 dB가 아니라 20 dB일까?',
    explanation: '같은 저항에 걸린 전압을 비교하면 P = V²/R이므로 전압이 10배일 때 전력은 100배가 된다. 전력비의 데시벨 정의에 대입하면 10 log₁₀(100) = 20 dB다. 입력·출력 임피던스가 다르면 전압비만으로 전력 이득을 구할 수 없고 실제 전력비를 써야 한다.',
    example: '두 지점의 부하가 모두 50 Ω일 때 0.1 V RMS → 1 V RMS는 전압비 10:1, 전력비 100:1, 전력 이득 20 dB다. 0 dBm은 부하 저항과 무관하게 1 mW를 뜻하지만, 그에 해당하는 전압은 저항에 따라 달라진다.',
    misconception: '“0 dBm = 0.775 V”는 600 Ω 부하에서만 성립한다.',
    sources: [
      { title: 'Analog Devices · dB 용어 정의', url: 'https://www.analog.com/en/resources/glossary/db.html' },
      { title: 'Keysight · Decibel 변환과 임피던스', url: 'https://helpfiles.keysight.com/csg/89600B/Webhelp/Subsystems/gettingstarted/content/concepts_decibels.htm' }
    ]
  }
};
