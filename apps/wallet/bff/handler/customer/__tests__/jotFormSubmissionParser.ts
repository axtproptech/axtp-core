import { JotFormSubmissionParser } from "@/bff/handler/customer/jotFormSubmissionParser";
import { submission } from "@/bff/handler/customer/jotFormResponseExample";

// TODO update tests
xdescribe("jotFormSubmissionParser", () => {
  it("it should parse as expected", () => {
    // @ts-ignore
    const parsed = new JotFormSubmissionParser(submission.content);
    expect(parsed.id).toBe("5389906570227915913");
    expect(parsed.cpf).toBe("464365436");
    expect(parsed.fullName).toEqual({
      first: "Digital",
      last: "ME",
    });
    expect(parsed.email).toBe("oliver@digital-independence.dev");
    expect(parsed.birthDate).toEqual(new Date("1976-11-23T03:00:00.000Z"));
    expect(parsed.birthPlace).toBe("Hanover");
    expect(parsed.occupation).toBe("Cozinheiro");
    expect(parsed.address).toEqual({
      addr_line1: "Rua Ariovaldo Marini, 105",
      city: "Valinhos",
      state: "SP",
      postal: "13279-172",
      country: "Brazil",
    });
    expect(parsed.residentProofUrls).toEqual([
      "https://www.jotform.com/uploads/clayhouseoh/222474866607061/5385606161011301029/unknown (4).png",
    ]);
    expect(parsed.documentType).toBe("cnh");
    expect(parsed.documentUrls).toEqual([
      "https://www.jotform.com/uploads/clayhouseoh/222474866607061/5385606161011301029/My mockup 2 from Urban Store Sign Mockups.jpg",
    ]);
  });
});
