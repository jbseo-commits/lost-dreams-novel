# 19~22화 시퀀스 원화 작업 기록

이번 시퀀스의 원본 PNG는 `/workspace/generated_images`에 보존한다. 생성기가 요청 해상도와 다른 네이티브 해상도를 반환할 수 있으므로 변환 전후 실제 치수를 기록하고 WebP quality 96/method 6으로 인코딩한다. 리사이즈·크롭은 하지 않는다.

[컷신 카드와 원문 배치](../ep019-022-cinematic-sequence-20261023.md) · [생성·인코딩 이력과 해시](provenance.json) · [마정훈 밤샘 상태 내부 참고](assets/ma-jeonghoon-overnight-reference.webp).

현재 맵은 18개 웹 컷을 유지하고 VN에는 기존 컷, B 미리보기, 이번 VN 전용 4개 연결 컷을 관리한다. provenance에는 현재 활성 Web 18개·VN 22개와 beat 71에서 대체된 VN 원화 1개를 합쳐 41개 기록이 있다. beat 71의 기존 `ep21-1-rescue` VN 원화는 다음 동작을 먼저 보여 주어 새 발견 컷으로 맵에서 대체했으며, 기존 파일과 제작 이력은 보존했다. Web rescue 원화는 바꾸지 않았다. 새 4개 PNG는 네이티브 1672×941 치수 그대로 WebP quality 96/method 6으로 인코딩하고 provenance에 source/encoded 해시, MIME, 치수, 프롬프트, 참조를 기록했다. [이전 통합 QA](../../vn/notes/sequence19-22-qa.json)와 이번 [4개 VN 컷 QA](../../vn/notes/sequence19-22-followup-qa.json)·[실제 앱 캡처](../../vn/notes/sequence19-22-followup-proof/)는 별도 기록이다. 이번 테스트는 4컷 slice와 기존 2-frame decode/fallback만 다루며, 전체 시퀀스 audit은 진행 중이다.
